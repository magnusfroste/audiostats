require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { generateAnalysisPrompt } = require('./prompt');
const { mockAnalysisResponse } = require('./mockData');

const app = express();

// Ensure uploads directory exists before configuring anything else
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads/');
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
    }
} catch (error) {
    console.error('Error creating uploads directory:', error);
}

// Configure CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Configure multer for file uploads with error handling
const upload = multer({ 
    dest: uploadDir,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
}).single('audio');

// Wrap multer middleware to handle errors
const handleUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ 
                success: false, 
                error: err.message || 'File upload failed' 
            });
        }
        next();
    });
};

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Configuration
const config = {
    models: {
        transcription: "whisper-1",
        analysis: process.env.GPT4_AUDIO_MODEL || "gpt-4o-mini-audio-preview"
    }
};

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Audio analysis endpoint
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

app.post('/analyze', handleUpload, async (req, res) => {
    // If using mock data, return it immediately
    if (USE_MOCK_DATA) {
        console.log('Using mock data for analysis');
        return res.json(mockAnalysisResponse);
    }

    let tempFilePath = null;
    let wavFilePath = null;
    let processingStep = 'start';

    try {
        console.log('Starting audio analysis...');
        processingStep = 'file validation';
        
        if (!req.file) {
            throw new Error('No audio file provided');
        }

        // Check file size (100MB limit)
        const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
        if (req.file.size > MAX_FILE_SIZE) {
            throw new Error('Audio file too large. Maximum size is 100MB');
        }

        console.log(`[Step: ${processingStep}] Received file:`, {
            name: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype
        });

        // Create temporary file paths
        processingStep = 'creating temp files';
        tempFilePath = req.file.path;
        wavFilePath = path.join('uploads', `${req.file.filename}.wav`);
        
        console.log(`[Step: ${processingStep}] Paths:`, { tempFilePath, wavFilePath });

        // Convert to WAV
        processingStep = 'wav conversion';
        console.log(`[Step: ${processingStep}] Starting...`);
        
        await new Promise((resolve, reject) => {
            ffmpeg(tempFilePath)
                .toFormat('wav')
                .audioChannels(1)  // Convert to mono
                .audioFrequency(16000)  // Reduce sample rate
                .on('start', (command) => {
                    console.log(`[Step: ${processingStep}] Command:`, command);
                })
                .on('progress', (progress) => {
                    if (progress && progress.percent) {
                        console.log(`[Step: ${processingStep}] Progress: ${Math.round(progress.percent)}%`);
                    }
                })
                .on('end', () => {
                    try {
                        const wavStats = fs.statSync(wavFilePath);
                        console.log(`[Step: ${processingStep}] Complete. WAV size: ${wavStats.size} bytes`);
                        resolve();
                    } catch (err) {
                        reject(new Error(`WAV file check failed: ${err.message}`));
                    }
                })
                .on('error', (err) => {
                    reject(new Error(`WAV conversion failed: ${err.message}`));
                })
                .save(wavFilePath);
        });

        // Get audio duration
        processingStep = 'duration check';
        console.log(`[Step: ${processingStep}] Starting...`);
        
        const duration = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(wavFilePath, (err, metadata) => {
                if (err) {
                    console.error(`[Step: ${processingStep}] Error:`, err);
                    reject(err);
                } else {
                    const duration = metadata.format.duration || 0;
                    console.log(`[Step: ${processingStep}] Complete. Duration: ${duration} seconds`);
                    resolve(duration);
                }
            });
        });

        // Validate duration (max 2 hours)
        const MAX_DURATION = 2 * 60 * 60; // 2 hours in seconds
        if (duration > MAX_DURATION) {
            throw new Error('Audio file too long. Maximum duration is 2 hours');
        }

        // Read WAV file as base64
        console.log('Reading WAV file...');
        const audioData = fs.readFileSync(wavFilePath);
        const base64Audio = audioData.toString('base64');
        console.log('Audio converted to base64, length:', base64Audio.length);

        // Step 1: Get transcription using Whisper
        processingStep = 'whisper transcription';
        console.log(`[Step: ${processingStep}] Starting...`);
        
        const transcriptionResponse = await openai.audio.transcriptions.create({
            file: fs.createReadStream(wavFilePath),
            model: config.models.transcription,
            response_format: "verbose_json",
            timestamp_granularities: ["segment"]
        }).catch(err => {
            console.error(`[Step: ${processingStep}] Error:`, err);
            if (err.response?.data) {
                console.error('API Response:', err.response.data);
            }
            throw new Error(`Transcription failed: ${err.message}`);
        });

        console.log(`[Step: ${processingStep}] Complete. Text length: ${transcriptionResponse.text.length}`);
        
        // Step 2: Analyze with GPT-4
        processingStep = 'gpt-4 analysis';
        console.log(`[Step: ${processingStep}] Starting...`);
        
        // Calculate prompt tokens from the prompt text
        const promptText = generateAnalysisPrompt(duration);
        const promptTokens = Math.ceil(promptText.length / 4); // Rough estimation: ~4 chars per token
        console.log(`Backend Calc Prompt Tokens: ${promptTokens}`);

        const response = await openai.chat.completions.create({
            model: config.models.analysis,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: promptText
                        },
                        {
                            type: "input_audio",
                            input_audio: {
                                data: base64Audio,
                                format: "wav"
                            }
                        }
                    ]
                }
            ],
            temperature: 0.1,
            max_tokens: 4096
        });

        console.log(`[Step: ${processingStep}] Complete. Response received`);
        
        // Log API-reported token usage
        if (response.usage) {
            console.log('API Token Usage:', {
                promptTokens: response.usage.prompt_tokens,
                completionTokens: response.usage.completion_tokens,
                totalTokens: response.usage.total_tokens
            });
        }

        // Calculate completion tokens from the response
        const completionText = response.choices?.[0]?.message?.content || '';
        const completionTokens = Math.ceil(completionText.length / 4); // Rough estimation
        console.log(`Backend Calc Completion Tokens: ${completionTokens}`);

        if (!response.choices?.[0]?.message?.content) {
            console.error(`[Step: ${processingStep}] No content in OpenAI response`);
            throw new Error('Invalid response from OpenAI');
        }

        const content = response.choices[0].message.content;
        let analysisData;

        try {
            analysisData = JSON.parse(content);
        } catch (parseError) {
            console.error(`[Step: ${processingStep}] Direct JSON parse failed:`, parseError);
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    analysisData = JSON.parse(jsonMatch[0]);
                } catch (e) {
                    console.error(`[Step: ${processingStep}] Failed to parse matched JSON:`, e);
                    throw new Error('Failed to parse analysis response');
                }
            } else {
                throw new Error('No valid JSON found in response');
            }
        }

        // Add the full Whisper transcription to the response
        analysisData.fullTranscript = {
            text: transcriptionResponse.text,
            segments: transcriptionResponse.segments
        };

        // Add token calculations and audio info to the development info
        analysisData.developmentInfo = {
            models: {
                transcription: config.models.transcription,
                analysis: config.models.analysis
            },
            audioInfo: {
                durationSeconds: duration,
                durationMinutes: Math.ceil(duration / 60),
                originalSize: req.file.size,
                wavSize: fs.statSync(wavFilePath).size
            },
            tokenUsage: {
                api: response.usage ? {
                    completion: response.usage.completion_tokens || 0,
                    prompt: response.usage.prompt_tokens || 0,
                    total: response.usage.total_tokens || 0
                } : null,
                backendCalc: {
                    prompt: promptTokens,
                    completion: completionTokens,
                    total: promptTokens + completionTokens
                }
            }
        };

        res.json({
            success: true,
            data: analysisData
        });

    } catch (error) {
        console.error(`Error in ${processingStep}:`, error);
        res.status(500).json({
            success: false,
            error: `Failed during ${processingStep}: ${error.message}`
        });
    } finally {
        // Clean up temporary files
        if (tempFilePath || wavFilePath) {
            console.log('Cleaning up temporary files...');
            try {
                if (tempFilePath) fs.unlinkSync(tempFilePath);
                if (wavFilePath) fs.unlinkSync(wavFilePath);
                console.log('Successfully cleaned up temporary files');
            } catch (cleanupError) {
                console.error('Error cleaning up files:', cleanupError);
            }
        }
    }
});

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for testing
module.exports = app; 
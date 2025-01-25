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

    try {
        console.log('Starting audio analysis...');
        
        if (!req.file) {
            throw new Error('No audio file provided');
        }

        // Check file size (100MB limit)
        const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
        if (req.file.size > MAX_FILE_SIZE) {
            throw new Error('Audio file too large. Maximum size is 100MB');
        }

        console.log('Received audio file:', req.file.originalname, 'Size:', req.file.size);

        // Create temporary file paths
        tempFilePath = req.file.path;
        wavFilePath = path.join('uploads', `${req.file.filename}.wav`);
        
        console.log('Temporary files:', { tempFilePath, wavFilePath });

        // Convert to WAV
        console.log('Starting WAV conversion...');
        await new Promise((resolve, reject) => {
            ffmpeg(tempFilePath)
                .toFormat('wav')
                .on('start', (command) => {
                    console.log('Started ffmpeg with command:', command);
                })
                .on('progress', (progress) => {
                    console.log('Processing: ', progress.percent, '% done');
                })
                .on('end', () => {
                    console.log('Successfully converted to WAV');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error converting to WAV:', err);
                    reject(err);
                })
                .save(wavFilePath);
        });

        // Get audio duration
        console.log('Getting audio duration...');
        const duration = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(wavFilePath, (err, metadata) => {
                if (err) {
                    console.error('Error getting audio duration:', err);
                    reject(err);
                } else {
                    const duration = metadata.format.duration || 0;
                    console.log('Audio duration:', duration, 'seconds');
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
        console.log('Getting transcription from Whisper...');
        const transcriptionResponse = await openai.audio.transcriptions.create({
            file: fs.createReadStream(wavFilePath),
            model: "whisper-1",
            response_format: "verbose_json",
            timestamp_granularities: ["segment"]
        });

        console.log('Transcription received, now analyzing with GPT-4...');
        
        // Step 2: Analyze with GPT-4
        const response = await openai.chat.completions.create({
            model: "gpt-4o-audio-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: generateAnalysisPrompt(duration)
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

        console.log('OpenAI response received');

        if (!response.choices?.[0]?.message?.content) {
            console.error('No content in OpenAI response');
            throw new Error('Invalid response from OpenAI');
        }

        const content = response.choices[0].message.content;
        let analysisData;

        try {
            analysisData = JSON.parse(content);
        } catch (parseError) {
            console.error('Direct JSON parse failed:', parseError);
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    analysisData = JSON.parse(jsonMatch[0]);
                } catch (e) {
                    console.error('Failed to parse matched JSON:', e);
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

        // Add development information about token usage
        analysisData.developmentInfo = {
            models: {
                transcription: "whisper-1",
                analysis: "gpt-4o-audio-preview"
            },
            tokenUsage: response?.usage ? {
                completion: response.usage.completion_tokens || 0,
                prompt: response.usage.prompt_tokens || 0,
                total: response.usage.total_tokens || 0
            } : {
                completion: 0,
                prompt: 0,
                total: 0
            }
        };

        res.json({
            success: true,
            data: analysisData
        });

    } catch (error) {
        console.error('Error in POST handler:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod'
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
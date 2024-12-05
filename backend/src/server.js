require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { generateAnalysisPrompt } = require('./prompt');

const app = express();

// Configure CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configure multer for file uploads
const upload = multer({ 
    dest: process.env.UPLOAD_DIR || 'uploads/',
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

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
app.post('/analyze', upload.single('audio'), async (req, res) => {
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

        console.log('Calling OpenAI API...');
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
            temperature: 0.3,
            max_tokens: 16384
        });

        console.log('OpenAI response received');

        if (!response.choices?.[0]?.message?.content) {
            console.error('No content in OpenAI response');
            throw new Error('No valid response content from OpenAI');
        }

        const content = response.choices[0].message.content.trim();
        console.log('Raw response:', content);

        // Try to find JSON in the response
        let analysisData;
        try {
            // First try direct JSON parse
            analysisData = JSON.parse(content);
            console.log('Successfully parsed JSON directly');
        } catch (parseError) {
            console.error('Direct JSON parse failed:', parseError);
            
            // If direct parse fails, try to find JSON object in text
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error('Raw content that failed to parse:', content);
                throw new Error('Could not find JSON in response');
            }
            try {
                analysisData = JSON.parse(jsonMatch[0]);
                console.log('Successfully parsed JSON from matched content');
            } catch (matchParseError) {
                console.error('Failed to parse matched content:', jsonMatch[0]);
                throw new Error('Failed to parse JSON from response');
            }
        }

        // Validate response structure
        if (!analysisData.participants || !Array.isArray(analysisData.participants)) {
            console.error('Invalid participants data:', analysisData.participants);
            throw new Error('Invalid participants data in response');
        }

        if (!analysisData.transcript || !Array.isArray(analysisData.transcript)) {
            console.error('Invalid transcript data:', analysisData.transcript);
            throw new Error('Invalid transcript data in response');
        }

        if (!analysisData.summary) {
            console.error('Missing summary data');
            throw new Error('Missing summary in response');
        }

        // Add avatars to participants
        const participantsWithAvatars = analysisData.participants.map((p, i) => {
            const avatarNumber = (i % 3) + 1;
            return {
                ...p,
                avatar: '/avatars/avatar-' + avatarNumber + '.svg'
            };
        });

        res.json({
            success: true,
            data: {
                ...analysisData,
                participants: participantsWithAvatars
            }
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
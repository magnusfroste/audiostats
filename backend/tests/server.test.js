const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');
const ffmpeg = require('fluent-ffmpeg');

// Mock modules
jest.mock('openai');
jest.mock('fluent-ffmpeg');
jest.mock('fs');

// Mock multer
jest.mock('multer', () => {
    return jest.fn().mockImplementation(() => ({
        single: () => (req, res, next) => {
            if (!req.headers['content-type']?.includes('multipart/form-data')) {
                req.file = null;
            } else {
                req.file = {
                    fieldname: 'audio',
                    originalname: 'test.mp3',
                    encoding: '7bit',
                    mimetype: 'audio/mpeg',
                    destination: 'uploads/',
                    filename: 'test-123',
                    path: 'uploads/test-123',
                    size: 1234
                };
            }
            next();
        }
    }));
});

// Import the express app
const app = require('../src/server');

// Create server instance for testing
let server;

describe('Server Endpoints', () => {
    beforeAll(() => {
        server = app.listen(3002);
    });

    afterAll((done) => {
        server.close(done);
    });

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Setup default fs mocks
        fs.existsSync.mockReturnValue(true);
        fs.createReadStream.mockReturnValue('mock-stream');
        fs.unlinkSync.mockImplementation(() => {});
    });

    // Test health endpoint
    describe('GET /health', () => {
        it('should return status ok', async () => {
            const response = await request(server)
                .get('/health');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: 'ok' });
        });
    });

    // Test analyze endpoint
    describe('POST /analyze', () => {
        beforeEach(() => {
            // Mock ffmpeg
            ffmpeg.mockReturnValue({
                toFormat: jest.fn().mockReturnThis(),
                on: jest.fn().mockImplementation((event, handler) => {
                    if (event === 'end') {
                        handler();
                    }
                    return this;
                }),
                save: jest.fn()
            });

            // Mock OpenAI response
            OpenAI.prototype.audio = {
                transcriptions: {
                    create: jest.fn().mockResolvedValue({
                        text: 'This is a test transcription'
                    })
                }
            };
        });

        it('should return 400 if no file is provided', async () => {
            const response = await request(server)
                .post('/analyze');
            
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: 'No audio file provided'
            });
        });

        it('should successfully process an audio file', async () => {
            const response = await request(server)
                .post('/analyze')
                .field('field', 'value')
                .attach('audio', Buffer.from('fake audio data'), 'test.mp3');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: {
                    transcript: 'This is a test transcription'
                }
            });

            // Verify OpenAI was called with correct model
            expect(OpenAI.prototype.audio.transcriptions.create)
                .toHaveBeenCalledWith({
                    file: 'mock-stream',
                    model: 'gpt-4-audio-preview'
                });

            // Verify cleanup
            expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
        }, 10000);

        it('should handle ffmpeg conversion error', async () => {
            // Mock ffmpeg to simulate error
            ffmpeg.mockReturnValue({
                toFormat: jest.fn().mockReturnThis(),
                on: jest.fn().mockImplementation((event, handler) => {
                    if (event === 'error') {
                        handler(new Error('FFmpeg error'));
                    }
                    return this;
                }),
                save: jest.fn()
            });

            const response = await request(server)
                .post('/analyze')
                .field('field', 'value')
                .attach('audio', Buffer.from('fake audio data'), 'test.mp3');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                error: 'Error processing audio file'
            });
        }, 10000);

        it('should handle OpenAI API error', async () => {
            // Mock OpenAI to throw error
            OpenAI.prototype.audio.transcriptions.create.mockRejectedValue(
                new Error('OpenAI API error')
            );

            const response = await request(server)
                .post('/analyze')
                .field('field', 'value')
                .attach('audio', Buffer.from('fake audio data'), 'test.mp3');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                error: 'Error processing audio file'
            });
        }, 10000);
    });
}); 
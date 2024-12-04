# Meeting Insights

A tool for analyzing meeting audio files using AI to provide insights about participation, interaction, and content.

## Project Structure

This is a monorepo containing both frontend and backend:

- `/frontend` - Next.js frontend application
- `/backend` - Express.js backend server

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:3001

## Deployment

### Frontend

The frontend is deployed on Vercel. To deploy:
1. Go to Vercel and create a new project
2. Select the `/frontend` directory during import
3. Set the environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Your Railway backend URL

### Backend

The backend is deployed on Railway. To deploy:
1. Go to Railway and create a new project
2. Select the `/backend` directory during import
3. Set the environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PORT`: 3001 (or let Railway set it)

## Features

- Audio file analysis
- Participant detection
- Speaking time analysis
- Interaction patterns
- Meeting transcription
- Key insights and summary
- Interactive visualization

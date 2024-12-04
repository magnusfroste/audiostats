'use client';

import { useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingState from '@/components/LoadingState';
import InteractionGraph from '@/components/InteractionGraph';
import { FileUploader } from '@/components/FileUploader';
import SummaryCard from '@/components/SummaryCard';
import ParticipantCard from '@/components/ParticipantCard';
import TranscriptViewer from '@/components/TranscriptViewer';
import AdvancedAnalysisCard from '@/components/AdvancedAnalysisCard';
import MeetingInsightsCard from '@/components/MeetingInsightsCard';
import type { Participant, TranscriptEntry, AnalysisSummary } from '@/types/analysis';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);

  const analyzeAudio = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setParticipants([]);
    setTranscript([]);
    setSummary(null);

    try {
      // First check if backend is available
      const healthCheck = await fetch(`${BACKEND_URL}/health`);
      if (!healthCheck.ok) {
        throw new Error('Backend server is not available. Please ensure the server is running.');
      }

      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze audio file');
      }

      setParticipants(data.data.participants);
      setTranscript(data.data.transcript);
      setSummary(data.data.summary);
    } catch (err) {
      console.error('Error analyzing audio:', err);
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError('Could not connect to the server. Please ensure the backend is running.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Meeting Insights 1.0</h1>
          
          <div className="grid gap-6">
            {/* File Upload Section */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
              <FileUploader onFileSelect={analyzeAudio} disabled={isAnalyzing} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </section>

            {/* Loading State */}
            {isAnalyzing && (
              <section className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <LoadingState />
                  <p className="mt-4 text-gray-600">Processing your audio file. This may take a few minutes...</p>
                </div>
              </section>
            )}

            {/* Results Section */}
            {participants.length > 0 && summary && (
              <div className="space-y-6">
                <section className="bg-white rounded-lg shadow p-6">
                  <SummaryCard summary={summary} />
                </section>

                <section className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Participants</h2>
                  <div className="grid gap-4">
                    {participants.map((participant) => (
                      <ParticipantCard 
                        key={participant.id} 
                        participant={participant}
                        totalDuration={summary.totalDuration}
                      />
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Interaction Graph</h2>
                  <InteractionGraph participants={participants} />
                </section>

                <section className="bg-white rounded-lg shadow p-6">
                  <AdvancedAnalysisCard summary={summary} />
                </section>

                <section className="bg-white rounded-lg shadow p-6">
                  <MeetingInsightsCard summary={summary} />
                </section>

                <section className="bg-white rounded-lg shadow p-6">
                  <TranscriptViewer transcript={transcript} />
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}

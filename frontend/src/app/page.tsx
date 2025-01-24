'use client';

import { useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingState from '@/components/LoadingState';
import { FileUploader } from '@/components/FileUploader';
import SummaryCard from '@/components/SummaryCard';
import ParticipantCard from '@/components/ParticipantCard';
import TranscriptViewer from '@/components/TranscriptViewer';
import AdvancedAnalysisCard from '@/components/AdvancedAnalysisCard';
import MeetingInsightsCard from '@/components/MeetingInsightsCard';
import JsonDisplay from '@/components/JsonDisplay';
import type { Participant, TranscriptEntry, AnalysisSummary } from '@/types/analysis';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [transcript, setTranscript] = useState(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const rawResponse = await response.json();
      
      if (!rawResponse.success) {
        throw new Error(rawResponse.error || 'Unknown error occurred');
      }

      const analysisData = rawResponse.data;
      setSummary(analysisData.summary);
      setParticipants(analysisData.participants);
      setTranscript(analysisData.fullTranscript);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Meet Anna - Your Team Focused Assistant</h1>
          
          <div className="grid gap-6">
            {/* File Upload Section */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
              <FileUploader onFileSelect={handleFileUpload} disabled={isLoading} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </section>

            {/* Loading State */}
            {isLoading && (
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

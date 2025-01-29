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
import DevelopmentInfo from '@/components/DevelopmentInfo';
import type { 
  Participant, 
  TranscriptEntry, 
  AnalysisSummary,
  Transcript,
  DevelopmentInfo as DevelopmentInfoType
} from '@/types/analysis';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [developmentInfo, setDevelopmentInfo] = useState<DevelopmentInfoType | null>(null);

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

      const rawResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(rawResponse.error || 'Server error: ' + response.status);
      }

      if (!rawResponse.success) {
        throw new Error(rawResponse.error || 'Unknown error occurred');
      }

      const analysisData = rawResponse.data;
      setSummary(analysisData.summary);
      setParticipants(analysisData.participants);
      setTranscript(analysisData.fullTranscript);
      setDevelopmentInfo(analysisData.developmentInfo);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meet Anna - Your Team Focused Assistant</h1>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Meeting Analysis</h2>
          </div>
          <FileUploader onFileSelect={handleFileUpload} disabled={isLoading} />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isLoading && <LoadingState />}

        {summary && !isLoading && (
          <div className="space-y-8">
            <SummaryCard summary={summary} />
            <div className="grid gap-4">
              {participants.map((participant) => (
                <ParticipantCard 
                  key={participant.id} 
                  participant={participant}
                  totalDuration={summary.totalDuration}
                />
              ))}
            </div>
            <AdvancedAnalysisCard summary={summary} />
            <MeetingInsightsCard summary={summary} />
            {transcript && <TranscriptViewer transcript={transcript} />}
            {developmentInfo && <DevelopmentInfo developmentInfo={developmentInfo} />}
          </div>
        )}
      </main>
    </ErrorBoundary>
  );
}

import React from 'react';

interface TokenUsage {
  completion: number;
  prompt: number;
  total: number;
}

interface AudioInfo {
  durationSeconds: number;
  durationMinutes: number;
  originalSize: number;
  wavSize: number;
}

interface DevelopmentInfoProps {
  developmentInfo: {
    models: {
      transcription: string;
      analysis: string;
    };
    audioInfo: AudioInfo;
    tokenUsage: {
      api: TokenUsage | null;
      backendCalc: TokenUsage;
    };
  };
}

const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

export default function DevelopmentInfo({ developmentInfo }: DevelopmentInfoProps) {
  return (
    <div className="bg-gray-50 rounded-lg shadow p-4 mt-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Development Information</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Models Used:</p>
            <ul className="list-disc list-inside ml-2">
              <li className="text-sm">Transcription: {developmentInfo.models.transcription}</li>
              <li className="text-sm">Analysis: <span className="font-medium text-blue-600">{developmentInfo.models.analysis}</span></li>
            </ul>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Audio Information:</p>
            <ul className="list-disc list-inside ml-2">
              <li className="text-sm">Duration: {developmentInfo.audioInfo.durationMinutes} minutes</li>
              <li className="text-sm">Original Size: {formatFileSize(developmentInfo.audioInfo.originalSize)}</li>
              <li className="text-sm">WAV Size: {formatFileSize(developmentInfo.audioInfo.wavSize)}</li>
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {developmentInfo.tokenUsage.api && (
            <div>
              <p className="text-sm font-medium text-gray-600">GPT-4 API-Reported Tokens:</p>
              <ul className="list-disc list-inside ml-2">
                <li className="text-sm">Completion: {developmentInfo.tokenUsage.api.completion}</li>
                <li className="text-sm">Prompt: {developmentInfo.tokenUsage.api.prompt}</li>
                <li className="text-sm">Total: {developmentInfo.tokenUsage.api.total}</li>
              </ul>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-600">GPT-4 Backend-Calculated Tokens:</p>
            <ul className="list-disc list-inside ml-2">
              <li className="text-sm">Completion: {developmentInfo.tokenUsage.backendCalc.completion}</li>
              <li className="text-sm">Prompt: {developmentInfo.tokenUsage.backendCalc.prompt}</li>
              <li className="text-sm">Total: {developmentInfo.tokenUsage.backendCalc.total}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

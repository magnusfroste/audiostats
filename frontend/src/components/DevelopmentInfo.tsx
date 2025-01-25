import React from 'react';

interface DevelopmentInfoProps {
  developmentInfo: {
    models: {
      transcription: string;
      analysis: string;
    };
    tokenUsage: {
      completion: number;
      prompt: number;
      total: number;
    };
  };
}

export default function DevelopmentInfo({ developmentInfo }: DevelopmentInfoProps) {
  return (
    <div className="bg-gray-50 rounded-lg shadow p-4 mt-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Development Information</h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-600">Models Used:</p>
          <ul className="list-disc list-inside ml-2">
            <li className="text-sm">Transcription: {developmentInfo.models.transcription}</li>
            <li className="text-sm">Analysis: {developmentInfo.models.analysis}</li>
          </ul>
        </div>
        <div>
          <p className="text-sm text-gray-600">Token Usage:</p>
          <ul className="list-disc list-inside ml-2">
            <li className="text-sm">Completion: {developmentInfo.tokenUsage.completion}</li>
            <li className="text-sm">Prompt: {developmentInfo.tokenUsage.prompt}</li>
            <li className="text-sm">Total: {developmentInfo.tokenUsage.total}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

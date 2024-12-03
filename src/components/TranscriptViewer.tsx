'use client';

import { TranscriptEntry } from '@/types/analysis';

interface TranscriptViewerProps {
  transcript: TranscriptEntry[];
}

export default function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const totalEntries = transcript.length;
  const totalDuration = transcript[transcript.length - 1]?.timestamp || "0:00";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Transcript</h2>
        <div className="text-gray-600">
          {totalEntries} entries over {totalDuration} minutes
        </div>
      </div>

      <div className="space-y-8">
        {transcript.map((entry, index) => (
          <div key={index} className="flex gap-8">
            <div className="text-gray-500 w-20 flex-shrink-0">
              {entry.timestamp}
            </div>
            <div className="flex-1">
              <div className="font-medium mb-2">{entry.speaker}</div>
              <div className="text-gray-600">
                {entry.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

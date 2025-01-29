'use client';

import { useState } from 'react';
import { ClipboardIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
}

interface TranscriptViewerProps {
  transcript: {
    text: string;
    segments: TranscriptSegment[];
  } | null;
}

export default function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!transcript) return null;

  const formatTime = (seconds: number): string => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  const getFormattedTranscript = (): string => {
    return transcript.segments
      .map(segment => {
        const timeRange = `[${formatTime(segment.start)} - ${formatTime(segment.end)}]`;
        return `${timeRange}\n${segment.text}\n`;
      })
      .join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFormattedTranscript());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transcript</h2>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all ${
            copied 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title={copied ? 'Copied!' : 'Copy formatted transcript'}
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="h-5 w-5" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
          <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="space-y-4">
        {transcript.segments.map((segment, index) => (
          <div key={index} className="border-b pb-2">
            <div className="text-sm text-gray-500">
              {formatTime(segment.start)} - {formatTime(segment.end)}
            </div>
            <div className="mt-1">{segment.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

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
  if (!transcript) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Transcript</h2>
      <div className="space-y-4">
        {transcript.segments.map((segment, index) => (
          <div key={index} className="border-b pb-2">
            <div className="text-sm text-gray-500">
              {new Date(segment.start * 1000).toISOString().substr(11, 8)} - 
              {new Date(segment.end * 1000).toISOString().substr(11, 8)}
            </div>
            <div className="mt-1">{segment.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

interface JsonDisplayProps {
  data: any;
}

export default function JsonDisplay({ data }: JsonDisplayProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Raw API Response</h3>
      <pre className="text-sm whitespace-pre-wrap break-words">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

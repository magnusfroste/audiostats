'use client';

import { AnalysisSummary } from '@/types/analysis';

interface SummaryCardProps {
  summary: AnalysisSummary;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Summary of Meeting</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total längd</div>
          <div className="text-xl font-semibold">
            {Math.floor(summary.totalDuration / 60)}m {Math.round(summary.totalDuration % 60)}s
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total taltid</div>
          <div className="text-xl font-semibold">
            {Math.floor(summary.totalSpeakingTime / 60)}m {Math.round(summary.totalSpeakingTime % 60)}s
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Most active</div>
          <div className="text-xl font-semibold">
            {summary.mostActive}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Least active</div>
          <div className="text-xl font-semibold">
            {summary.leastActive}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Key Topics</h3>
          <ul className="space-y-2">
            {summary.topics.map((topic, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{topic.name}</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(topic.timeSpent / 60)}m
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {topic.participants.join(', ')}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Decisions Made</h3>
          <ul className="space-y-2">
            {summary.decisions.map((decision, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded-md">
                <div className="font-medium">{decision.decision}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Topic: {decision.topic}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Agreed by: {decision.agreedBy.join(', ')}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { AnalysisSummary } from '@/types/analysis';
import { UsersIcon, ChartBarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface MeetingInsightsCardProps {
  summary: AnalysisSummary;
}

export default function MeetingInsightsCard({ summary }: MeetingInsightsCardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Meeting Insights</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <UsersIcon className="h-5 w-5" />
            <div className="text-sm">Participation Balance</div>
          </div>
          <div className="text-2xl font-semibold">{summary.participationBalance}%</div>
          <div className="text-sm text-gray-600">Even distribution of speaking time</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <ChartBarIcon className="h-5 w-5" />
            <div className="text-sm">Engagement Level</div>
          </div>
          <div className="text-2xl font-semibold">{summary.overallEngagement}%</div>
          <div className="text-sm text-gray-600">Based on interactions and tone</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <ClockIcon className="h-5 w-5" />
            <div className="text-sm">Average Speaking Time</div>
          </div>
          <div className="text-2xl font-semibold">{Math.round(summary.averageSpeakingTime)}s</div>
          <div className="text-sm text-gray-600">Per intervention</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <CheckCircleIcon className="h-5 w-5" />
            <div className="text-sm">Decisions Made</div>
          </div>
          <div className="text-2xl font-semibold">{summary.decisions.length}</div>
          <div className="text-sm text-gray-600">Key agreements reached</div>
        </div>
      </div>

      {/* Action Items */}
      {summary.actionItems.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Action Items</h3>
          <div className="bg-white rounded-lg border divide-y">
            {summary.actionItems.map((item, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.description}</div>
                    <div className="text-sm text-gray-600">Assigned to: {item.assignedTo}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Mentioned at {item.mentionedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decisions */}
      {summary.decisions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Key Decisions</h3>
          <div className="bg-white rounded-lg border divide-y">
            {summary.decisions.map((decision, index) => (
              <div key={index} className="p-4">
                <div className="font-medium">{decision.decision}</div>
                <div className="text-sm text-gray-600 mt-1">Topic: {decision.topic}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Agreed by: {decision.agreedBy.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
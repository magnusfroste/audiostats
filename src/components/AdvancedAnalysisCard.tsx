'use client';

import { AnalysisSummary } from '@/types/analysis';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface AdvancedAnalysisCardProps {
  summary: AnalysisSummary;
}

export default function AdvancedAnalysisCard({ summary }: AdvancedAnalysisCardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Advanced Analysis</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg mb-4">Discussion Topics</h3>
          {summary.topics.map((topic, index) => (
            <div key={index} className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="text-lg mb-1">{topic.name}</div>
              <div className="text-gray-600 mb-1">Participants: {topic.participants.join(', ')}</div>
              <div className="text-purple-600">{Math.round(topic.timeSpent / 60)}min</div>
              <div className="text-green-600">Sentiment: {topic.sentiment}</div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg mb-4">Meeting Quality</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="text-blue-600 text-2xl font-semibold">{summary.discussionQuality.score}%</div>
              <div className="w-3/4 h-2 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${summary.discussionQuality.score}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-gray-600 mb-2">Strengths:</div>
                {summary.discussionQuality.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center text-gray-700 mb-1">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    {strength}
                  </div>
                ))}
              </div>

              <div>
                <div className="text-gray-600 mb-2">Areas for Improvement:</div>
                {summary.discussionQuality.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center text-gray-700 mb-1">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    {improvement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
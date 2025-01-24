'use client';

import { Participant } from '@/types/analysis';
import Image from 'next/image';

interface ParticipantCardProps {
  participant: Participant;
  totalDuration: number;
}

export default function ParticipantCard({ participant, totalDuration }: ParticipantCardProps) {
  const speakingPercentage = (participant.speakingTime / totalDuration) * 100;
  
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="relative w-12 h-12">
          <Image
            src={participant.avatar || '/avatars/avatar-1.svg'}
            alt={participant.name}
            fill
            className="rounded-full"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{participant.name}</h3>
          <div className="text-sm text-gray-500">
            Speaking time: {Math.round(participant.speakingTime)}s ({Math.round(speakingPercentage)}%)
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Emotional Tone</span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
            <div 
              className="bg-green-400" 
              style={{ width: `${participant.emotionalTone.positive}%` }}
            />
            <div 
              className="bg-yellow-200" 
              style={{ width: `${participant.emotionalTone.neutral}%` }}
            />
            <div 
              className="bg-red-400" 
              style={{ width: `${participant.emotionalTone.negative}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Interventions</span>
            <div className="font-medium">{participant.interventions}</div>
          </div>
          <div>
            <span className="text-gray-500">Interruptions</span>
            <div className="font-medium">
              Made: {participant.interruptionsMade} / 
              Received: {participant.timesInterrupted}
            </div>
          </div>
        </div>

        {participant.dominantEmotions.length > 0 && (
          <div>
            <span className="text-sm text-gray-500">Dominant Emotions</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {participant.dominantEmotions.map((emotion, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
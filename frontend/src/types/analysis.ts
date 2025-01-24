export interface Participant {
  id: string;
  name: string;
  speakingTime: number;
  interventions: number;
  interactions: { [key: string]: number };
  interruptionsMade: number;
  timesInterrupted: number;
  emotionalTone: {
    positive: number;
    neutral: number;
    negative: number;
  };
  dominantEmotions: string[];
  avatar?: string;
}

export interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  text: string;
  emotion: string;
  topic: string;
}

export interface Topic {
  name: string;
  timeSpent: number;
  participants: string[];
  sentiment: string;
}

export interface Decision {
  topic: string;
  decision: string;
  agreedBy: string[];
}

export interface ActionItem {
  description: string;
  assignedTo: string;
  mentionedAt: string;
}

export interface DiscussionQuality {
  score: number;
  strengths: string[];
  improvements: string[];
}

export interface EmotionalAnalysis {
  overallTone: string;
  toneDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  dominantEmotions: string[];
  emotionalDynamics: string;
}

export interface InteractionPatterns {
  frequentInteractions: {
    between: string[];
    count: number;
    nature: string;
  }[];
  interruptions: {
    total: number;
    mostFrequent: {
      interrupter: string;
      interrupted: string;
      count: number;
    };
  };
}

export interface AnalysisSummary {
  totalDuration: number;
  totalSpeakingTime: number;
  totalTalkTime: number;
  mostActive: string;
  leastActive: string;
  averageSpeakingTime: number;
  interactionDensity: number;
  topicChanges: number;
  dominantSpeaker: {
    name: string;
    percentage: number;
  };
  participationBalance: number;
  overallEngagement: number;
  topics: Topic[];
  decisions: Decision[];
  actionItems: ActionItem[];
  discussionQuality: DiscussionQuality;
  emotionalAnalysis: EmotionalAnalysis;
  interactionPatterns: InteractionPatterns;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
}

export interface Transcript {
  text: string;
  segments: TranscriptSegment[];
}
const mockAnalysisResponse = {
  success: true,
  data: {
    participants: [
      {
        id: "speaker_1",
        name: "Anna",
        speakingTime: 180.5,
        interventions: 12,
        interactions: {
          "speaker_2": 5,
          "speaker_3": 3
        },
        interruptionsMade: 1,
        timesInterrupted: 2,
        emotionalTone: {
          positive: 70,
          neutral: 25,
          negative: 5
        },
        dominantEmotions: ["engaged", "enthusiastic"]
      },
      {
        id: "speaker_2",
        name: "Marcus",
        speakingTime: 160.2,
        interventions: 8,
        interactions: {
          "speaker_1": 5,
          "speaker_3": 4
        },
        interruptionsMade: 2,
        timesInterrupted: 1,
        emotionalTone: {
          positive: 65,
          neutral: 30,
          negative: 5
        },
        dominantEmotions: ["focused", "analytical"]
      },
      {
        id: "speaker_3",
        name: "Sarah",
        speakingTime: 140.8,
        interventions: 6,
        interactions: {
          "speaker_1": 3,
          "speaker_2": 4
        },
        interruptionsMade: 0,
        timesInterrupted: 2,
        emotionalTone: {
          positive: 75,
          neutral: 20,
          negative: 5
        },
        dominantEmotions: ["supportive", "collaborative"]
      }
    ],
    summary: {
      totalDuration: 600,
      totalSpeakingTime: 481.5,
      totalTalkTime: 520,
      mostActive: "speaker_1",
      leastActive: "speaker_3",
      averageSpeakingTime: 160.5,
      interactionDensity: 3.2,
      topicChanges: 5,
      dominantSpeaker: {
        id: "speaker_1",
        percentage: 37.5
      },
      participationBalance: 85,
      overallEngagement: 90,
      topics: [
        {
          name: "Project Timeline",
          timeSpent: 180,
          participants: ["speaker_1", "speaker_2", "speaker_3"],
          sentiment: "positive"
        },
        {
          name: "Budget Discussion",
          timeSpent: 240,
          participants: ["speaker_1", "speaker_2"],
          sentiment: "neutral"
        },
        {
          name: "Team Resources",
          timeSpent: 180,
          participants: ["speaker_1", "speaker_3"],
          sentiment: "positive"
        }
      ],
      decisions: [
        {
          topic: "Project Timeline",
          decision: "Launch date set for next quarter",
          agreedBy: ["speaker_1", "speaker_2", "speaker_3"]
        },
        {
          topic: "Budget Discussion",
          decision: "Increase resource allocation by 20%",
          agreedBy: ["speaker_1", "speaker_2"]
        }
      ],
      actionItems: [
        {
          description: "Prepare detailed project timeline",
          assignedTo: "speaker_2",
          mentionedAt: "00:05:30"
        },
        {
          description: "Schedule resource planning meeting",
          assignedTo: "speaker_1",
          mentionedAt: "00:08:45"
        }
      ],
      discussionQuality: {
        score: 88,
        strengths: ["balanced participation", "clear decision-making", "positive engagement"],
        improvements: ["reduce interruptions", "more follow-up questions"]
      },
      emotionalAnalysis: {
        overallTone: "positive",
        toneDistribution: {
          positive: 70,
          neutral: 25,
          negative: 5
        },
        dominantEmotions: ["engaged", "collaborative"],
        emotionalDynamics: "Consistently positive with heightened engagement during decision points"
      }
    },
    fullTranscript: {
      text: "Complete meeting transcript text here...",
      segments: [
        {
          text: "Good morning everyone. Let's discuss the project timeline for Q1.",
          start: 0,
          end: 4.2
        },
        {
          text: "I think we should focus on the critical path first.",
          start: 4.8,
          end: 7.5
        },
        {
          text: "Agreed. The main deliverables need to be scheduled carefully.",
          start: 8.1,
          end: 12.4
        },
        {
          text: "What about the budget implications of this timeline?",
          start: 13.0,
          end: 16.2
        },
        {
          text: "We'll need to increase our resource allocation to meet these deadlines.",
          start: 16.8,
          end: 21.5
        }
      ]
    }
  }
};

module.exports = { mockAnalysisResponse };

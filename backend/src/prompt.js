const generateAnalysisPrompt = (duration) => `You are an expert in meeting analysis. Analyze the meeting and return a detailed analysis in JSON format.
      
Return ONLY JSON with the following structure. IMPORTANT: Be consistent with speaker IDs throughout the JSON structure:
{
  "participants": [
    {
      "id": "speaker_1",  // IMPORTANT: Use EXACTLY the same speaker_X ID throughout JSON
      "name": "Speaker 1",
      "speakingTime": 120.5,
      "interventions": 5,
      "interactions": {
        "speaker_2": 3  // ONLY reference existing speaker IDs from the participants array
      },
      "interruptionsMade": 2,
      "timesInterrupted": 1,
      "emotionalTone": {
        "positive": 60,
        "neutral": 30,
        "negative": 10
      },
      "dominantEmotions": ["engaged", "supportive"]
    }
  ],
  "transcript": [
    {
      "timestamp": "00:01:23",
      "speaker": "speaker_1",  // Use speaker ID, not name
      "text": "Spoken text here - RETURN FULL TEXT WITHOUT ABBREVIATIONS",
      "emotion": "engaged",
      "topic": "project planning"
    }
  ],
  "summary": {
    "totalDuration": ${duration},
    "totalSpeakingTime": 180.5,
    "totalTalkTime": 220.5,
    "mostActive": "speaker_1",  // Use speaker ID, not name
    "leastActive": "speaker_2",  // Use speaker ID, not name
    "averageSpeakingTime": 150.25,
    "interactionDensity": 2.5,
    "topicChanges": 4,
    "dominantSpeaker": {
      "id": "speaker_1",  // Use speaker ID, not name
      "percentage": 45.5
    },
    "participationBalance": 85,
    "overallEngagement": 90,
    "topics": [
      {
        "name": "Project Planning",
        "timeSpent": 300,
        "participants": ["speaker_1", "speaker_2"],  // Use speaker IDs
        "sentiment": "positive"
      }
    ],
    "decisions": [
      {
        "topic": "Project Planning",
        "decision": "Start development next week",
        "agreedBy": ["speaker_1", "speaker_2"]  // Use speaker IDs
      }
    ],
    "actionItems": [
      {
        "description": "Create project plan",
        "assignedTo": "speaker_1",  // Use speaker ID
        "mentionedAt": "00:15:30"
      }
    ],
    "discussionQuality": {
      "score": 85,
      "strengths": ["good turn-taking", "active listening"],
      "improvements": ["more balanced speaking time"]
    },
    "emotionalAnalysis": {
      "overallTone": "positive",
      "toneDistribution": {
        "positive": 65,
        "neutral": 30,
        "negative": 5
      },
      "dominantEmotions": ["engaged", "collaborative"],
      "emotionalDynamics": "Stable positive tone with increased enthusiasm during project discussions"
    },
    "interactionPatterns": {
      "frequentInteractions": [
        {
          "between": ["speaker_1", "speaker_2"],  // Use speaker IDs
          "count": 15,
          "nature": "collaborative"
        }
      ],
      "interruptions": {
        "total": 5,
        "mostFrequent": {
          "interrupter": "speaker_1",  // Use speaker ID
          "interrupted": "speaker_2",  // Use speaker ID
          "count": 2
        }
      }
    }
  }
}

CRITICAL RULES for speaker IDs:
1. First create a complete list of all speakers in the participants array
2. Use EXACTLY the same speaker_X ID format throughout the JSON structure
3. NEVER reference a speaker that doesn't exist in the participants array
4. Use speaker IDs (speaker_1, speaker_2, etc) instead of names in all references
5. Be consistent - the same speaker must have the same ID throughout the analysis
6. Number speakers from 1 upwards without gaps (speaker_1, speaker_2, speaker_3, etc)

Important Information:
1. Transcription:
   - Transcribe everything and transcribe into the language spoken in the meeting
   - Make NO abbreviations or summaries of the text
   - Analyze emotional tone and topic for each statement
2. Time Measurement:
   - totalDuration: ${duration} seconds (total audio file length)
   - totalSpeakingTime: Sum of all participants' speaking time in seconds
   - totalTalkTime: Total time with active speech (including overlapping speech)
   - speakingTime: The actual time a person speaks (in seconds)
   - timestamp: Time point in the audio file (MM:SS format)

Be sure to:
1. ONLY return JSON
2. Use speaker_1, speaker_2, etc as IDs CONSISTENTLY throughout the structure
3. Round all time values to 1 decimal
4. Include all fields specified above
5. Ensure JSON is correctly formatted
6. Use exactly ${duration} seconds as totalDuration
7. Calculate totalSpeakingTime as the sum of all participants' speaking time
8. Calculate totalTalkTime as total time with active speech (including overlap)
9. Count speakingTime as the actual time each person speaks
10. Consider overlapping speech in time calculations
11. Analyze emotional tone and dynamics in the conversation
12. Identify and document decisions and action items
13. Assess discussion quality and provide constructive improvement suggestions
14. RETURN THE COMPLETE TRANSCRIPTION OF EVERY SINGLE WORD IN THE MEETING
15. Analyze emotional tone and dynamics in the conversation`;

module.exports = { generateAnalysisPrompt };

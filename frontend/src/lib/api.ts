import { z } from 'zod'

// API base URL - will use deployed backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gaiapulse-ibm-hack25-production.up.railway.app'

// Zod schemas for API validation
export const CurrentMoodSchema = z.object({
  success: z.boolean(),
  data: z.object({
    mood: z.string(),
    score: z.number(),
    timestamp: z.string(),
    predictive_statement: z.string(),
    confidence: z.number(),
    factors: z.array(z.string()),
    trend: z.string(),
    next_update: z.string()
  }),
  message: z.string()
})

export const PointSchema = z.object({
  timestamp: z.string(),
  value: z.number(),
  unit: z.string(),
  source: z.enum(['nasa', 'weather', 'air_quality', 'ocean', 'forest', 'satellite', 'sensor', 'ai_prediction']),
  confidence: z.number(),
  metadata: z.record(z.string(), z.any()).optional()
})

export const PulseHistorySchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: z.array(PointSchema),
    period: z.string(),
    aggregation: z.string(),
    total_points: z.number()
  }),
  message: z.string()
})

export const ChatResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    response: z.string(),
    confidence: z.number(),
    sources: z.array(z.string()),
    suggestions: z.array(z.string()),
    timestamp: z.string()
  }),
  message: z.string()
})

// TypeScript types inferred from schemas
export type CurrentMood = z.infer<typeof CurrentMoodSchema>['data']
export type Point = z.infer<typeof PointSchema>
export type PulseHistory = z.infer<typeof PulseHistorySchema>['data']
export type ChatResponse = z.infer<typeof ChatResponseSchema>['data']

// API functions
export async function fetchCurrentMood(): Promise<CurrentMood> {
  const response = await fetch(`${API_BASE_URL}/api/v1/mood/current_mood`)
  if (!response.ok) {
    throw new Error('Failed to fetch current mood')
  }
  const data = await response.json()
  return CurrentMoodSchema.parse(data).data
}

export async function fetchPulseHistory(days: number = 7): Promise<PulseHistory> {
  const response = await fetch(`${API_BASE_URL}/api/v1/mood/pulse_history?days=${days}`)
  if (!response.ok) {
    throw new Error('Failed to fetch pulse history')
  }
  const data = await response.json()
  return PulseHistorySchema.parse(data).data
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      context: 'environmental_monitoring',
      timestamp: new Date().toISOString()
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to send chat message')
  }
  const data = await response.json()
  return ChatResponseSchema.parse(data).data
}

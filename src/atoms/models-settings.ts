import { atomWithStorage } from 'jotai/utils'

export const modelTypes = {
  OpenRouter: 'OpenRouter',
  DeepSeek: 'DeepSeek',
  Xai: 'Xai',
  Vercel: 'Vercel',
  Anthropic: 'Anthropic',
  Groq: 'Groq',
  Google: 'Google',
  // Luma: 'Luma',
} as const

export type ModelType = (typeof modelTypes)[keyof typeof modelTypes]

export interface Model {
  id: string
  type: ModelType
  name: string
  model: string
  baseURL: string
  apiKey: string
}

export const defaultModel: Omit<Model, 'id'> = {
  name: 'OpenRouter',
  type: modelTypes.OpenRouter,
  baseURL: 'https://openrouter.ai/api/v1',
  model: 'openai/gpt-oss-20b:free',
  apiKey: '',
}

export const modelsSettingsAtom = atomWithStorage<{
  id: string | undefined
  models: Model[]
}>('models-settings', {
  id: undefined,
  models: [
    {
      ...defaultModel,
      type: modelTypes.OpenRouter,
      id: new Date().getTime().toString(),
    },
  ],
})

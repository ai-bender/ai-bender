import { atomWithStorage } from 'jotai/utils'

export const modelTypes = {
  OpenRouter: 'OpenRouter',
  DeepSeek: 'DeepSeek',
} as const

export type ModelType = (typeof modelTypes)[keyof typeof modelTypes]

export interface Model {
  id: number
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
  id: number
  models: Model[]
}>('models-settings', {
  id: 0,
  models: [
    {
      ...defaultModel,
      type: modelTypes.OpenRouter,
      id: new Date().getTime(),
    },
  ],
})

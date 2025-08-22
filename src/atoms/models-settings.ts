import { atomWithStorage } from 'jotai/utils'
import { Models } from '~/models'
import type { ModelName } from '~/models'

export interface Model {
  id: string
  type: ModelName
  name: string
  model: string
  baseURL: string
  apiKey: string
}

export const defaultModel: Omit<Model, 'id'> = {
  name: 'OpenRouter',
  type: Models.OpenRouter.name,
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
      type: Models.OpenRouter.name,
      id: new Date().getTime().toString(),
    },
  ],
})

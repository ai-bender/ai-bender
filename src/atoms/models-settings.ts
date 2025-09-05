import { atomWithStorage } from 'jotai/utils'
import { Models } from '~/models'
import type { Model } from '~/db'

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
  models: [],
})

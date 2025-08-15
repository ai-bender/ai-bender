import { atomWithStorage } from 'jotai/utils'

export const openrouterAtom = atomWithStorage('openrouter-models', {
  apiKey: '',
  baseURL: 'https://openrouter.ai/api/v1',
  model: 'openai/gpt-oss-20b:free',
})

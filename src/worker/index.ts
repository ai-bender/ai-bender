/* eslint-disable no-restricted-globals */
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { convertToModelMessages, streamText } from 'ai'
import { createEneo } from 'eneo'
import type { UIMessage } from 'ai'

const openRouter = createOpenRouter({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:
    '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',
})

const workerFunctions = {
  async *chat(messages: UIMessage[]) {
    const result = streamText({
      model: openRouter('openai/gpt-oss-20b:free'),
      prompt: convertToModelMessages(messages),
    })

    const iterator = result.toUIMessageStream()

    for await (const chunk of iterator) {
      yield chunk
    }
  },
}

export type WorkerFunctions = typeof workerFunctions

createEneo(workerFunctions, {
  post: (data) => self.postMessage(data),
  on: (fn) => self.addEventListener('message', fn),
  off: (fn) => self.removeEventListener('message', fn),
  deserialize: (e) => e.data,
})

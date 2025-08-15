/* eslint-disable no-restricted-globals */
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { convertToModelMessages, streamText } from 'ai'
import { createEneo } from 'eneo'
import type { UIMessage } from 'ai'

const workerFunctions = {
  async *chat({
    messages,
    body,
  }: {
    messages: UIMessage[]
    body: {
      model: string
      apiKey: string
      baseURL?: string
    }
  }) {
    const { model, apiKey, baseURL = 'https://openrouter.ai/api/v1' } = body

    const openRouter = createOpenRouter({
      baseURL,
      apiKey,
    })

    const result = streamText({
      model: openRouter(model),
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

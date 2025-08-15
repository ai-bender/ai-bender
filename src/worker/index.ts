/* eslint-disable no-restricted-globals */
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { convertToModelMessages, streamText } from 'ai'
import { createEneo } from 'eneo'
import { match } from 'ts-pattern'
import { modelTypes } from '~/atoms/models-settings'
import type { UIMessage } from 'ai'
import type { ModelType } from '~/atoms/models-settings'

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
      type: ModelType
    }
  }) {
    const {
      type,
      model,
      apiKey,
      baseURL = 'https://openrouter.ai/api/v1',
    } = body

    const modelInstance = match(type)
      .with(modelTypes.OpenRouter, () =>
        createOpenRouter({
          baseURL,
          apiKey,
        })(model),
      )
      .with(modelTypes.DeepSeek, () =>
        createDeepSeek({
          baseURL,
          apiKey,
        })(model),
      )
      .exhaustive()

    const result = streamText({
      model: modelInstance,
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

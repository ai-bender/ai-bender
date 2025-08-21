/* eslint-disable no-restricted-globals */
import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { createVercel } from '@ai-sdk/vercel'
import { createXai } from '@ai-sdk/xai'
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
      .with(modelTypes.Xai, () =>
        createXai({
          baseURL,
          apiKey,
        })(model),
      )
      .with(modelTypes.Vercel, () =>
        createVercel({
          baseURL,
          apiKey,
        })(model),
      )
      .with(modelTypes.Anthropic, () =>
        createAnthropic({
          baseURL,
          apiKey,
        })(model),
      )
      .with(modelTypes.Groq, () =>
        createGroq({
          baseURL,
          apiKey,
        })(model),
      )
      .with(modelTypes.Google, () =>
        createGoogleGenerativeAI({
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

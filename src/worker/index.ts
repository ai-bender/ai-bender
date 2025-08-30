/* eslint-disable no-restricted-globals */
import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { createOpenAI } from '@ai-sdk/openai'
import { createVercel } from '@ai-sdk/vercel'
import { createXai } from '@ai-sdk/xai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { convertToModelMessages, streamText } from 'ai'
import { createEneo } from 'eneo'
import { match } from 'ts-pattern'
import { Models } from '~/models'
import type { UIMessage } from 'ai'
import type { ModelName } from '~/models'

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
      type: ModelName
    }
  }) {
    const {
      type,
      model,
      apiKey,
      baseURL = 'https://openrouter.ai/api/v1',
    } = body

    const modelInstance = match(type)
      .with(Models.OpenAI.name, () =>
        createOpenAI({
          baseURL,
          apiKey,
        })(model),
      )
      .with(Models.OpenRouter.name, () =>
        createOpenRouter({
          baseURL,
          apiKey,
        })(model),
      )
      .with(Models.DeepSeek.name, () =>
        createDeepSeek({
          baseURL,
          apiKey,
        })(model),
      )
      .with(Models.Xai.name, () =>
        createXai({
          baseURL,
          apiKey,
        })(model),
      )
      .with(Models.Vercel.name, () =>
        createVercel({
          baseURL,
          apiKey,
        })(model),
      )
      .with(Models.Anthropic.name, () =>
        createAnthropic({
          baseURL,
          apiKey,
        })(model),
      )
      .with(Models.Groq.name, () =>
        createGroq({
          baseURL,
          apiKey,
        })(model),
      )
      .with(Models.Google.name, () =>
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

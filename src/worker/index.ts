import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'

const openRouter = createOpenRouter({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:
    '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',
})

async function main() {
  const result = await generateText({
    model: openRouter('openai/gpt-oss-20b:free'),
    prompt: 'Hello, world!',
  })

  console.log(result)
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', () => {
  main()
})

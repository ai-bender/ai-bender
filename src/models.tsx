/* eslint-disable react-refresh/only-export-components */
import {
  AnthropicLogo,
  DeepSeekLogo,
  GoogleLogo,
  GroqLogo,
  OpenAILogo,
  OpenRouterLogo,
  VercelLogo,
  XaiLogo,
} from './logos'
import type { AnthropicProvider } from '@ai-sdk/anthropic'
import type { DeepSeekProvider } from '@ai-sdk/deepseek'
import type { GoogleGenerativeAIProvider } from '@ai-sdk/google'
import type { GroqProvider } from '@ai-sdk/groq'
import type { OpenAIProvider } from '@ai-sdk/openai'
import type { VercelProvider } from '@ai-sdk/vercel'
import type { XaiProvider } from '@ai-sdk/xai'
import type { OpenRouterProvider } from '@openrouter/ai-sdk-provider'
import type { ReactNode } from 'react'

type Literals<T> = T extends string ? (string extends T ? never : T) : never

function createModel<
  Name extends string = string,
  ModelId extends string = string,
  ImageModelId extends string = string,
>({
  name,
  logo,
  baseURL,
  chat,
  image,
}: {
  name: Name
  logo: ReactNode
  baseURL?: string
  chat: Record<ModelId, { id: ModelId }>
  image?: Record<ImageModelId, { id: ImageModelId }>
}) {
  return {
    name,
    logo,
    baseURL,
    chat,
    image,
  }
}

export const openai = createModel<
  'OpenAI',
  Literals<Parameters<OpenAIProvider['chat']>[0]>,
  Literals<Parameters<OpenAIProvider['image']>[0]>
>({
  name: 'OpenAI',
  logo: <OpenAILogo />,
  baseURL: 'https://api.openai.com/v1',
  chat: {
    'o1': { id: 'o1' },
    'o1-2024-12-17': { id: 'o1-2024-12-17' },
    'o3-mini': { id: 'o3-mini' },
    'o3-mini-2025-01-31': { id: 'o3-mini-2025-01-31' },
    'o3': { id: 'o3' },
    'o3-2025-04-16': { id: 'o3-2025-04-16' },
    'gpt-4.1': { id: 'gpt-4.1' },
    'gpt-4.1-2025-04-14': { id: 'gpt-4.1-2025-04-14' },
    'gpt-4.1-mini': { id: 'gpt-4.1-mini' },
    'gpt-4.1-mini-2025-04-14': { id: 'gpt-4.1-mini-2025-04-14' },
    'gpt-4.1-nano': { id: 'gpt-4.1-nano' },
    'gpt-4.1-nano-2025-04-14': { id: 'gpt-4.1-nano-2025-04-14' },
    'gpt-4o': { id: 'gpt-4o' },
    'gpt-4o-2024-05-13': { id: 'gpt-4o-2024-05-13' },
    'gpt-4o-2024-08-06': { id: 'gpt-4o-2024-08-06' },
    'gpt-4o-2024-11-20': { id: 'gpt-4o-2024-11-20' },
    'gpt-4o-mini': { id: 'gpt-4o-mini' },
    'gpt-4o-mini-2024-07-18': { id: 'gpt-4o-mini-2024-07-18' },
    'gpt-4-turbo': { id: 'gpt-4-turbo' },
    'gpt-4-turbo-2024-04-09': { id: 'gpt-4-turbo-2024-04-09' },
    'gpt-4': { id: 'gpt-4' },
    'gpt-4-0613': { id: 'gpt-4-0613' },
    'gpt-4.5-preview': { id: 'gpt-4.5-preview' },
    'gpt-4.5-preview-2025-02-27': { id: 'gpt-4.5-preview-2025-02-27' },
    'gpt-3.5-turbo-0125': { id: 'gpt-3.5-turbo-0125' },
    'gpt-3.5-turbo': { id: 'gpt-3.5-turbo' },
    'gpt-3.5-turbo-1106': { id: 'gpt-3.5-turbo-1106' },
    'chatgpt-4o-latest': { id: 'chatgpt-4o-latest' },
    'gpt-5': { id: 'gpt-5' },
    'gpt-5-2025-08-07': { id: 'gpt-5-2025-08-07' },
    'gpt-5-mini': { id: 'gpt-5-mini' },
    'gpt-5-mini-2025-08-07': { id: 'gpt-5-mini-2025-08-07' },
    'gpt-5-nano': { id: 'gpt-5-nano' },
    'gpt-5-nano-2025-08-07': { id: 'gpt-5-nano-2025-08-07' },
    'gpt-5-chat-latest': { id: 'gpt-5-chat-latest' },
  },
  image: {
    'gpt-image-1': { id: 'gpt-image-1' },
    'dall-e-3': { id: 'dall-e-3' },
    'dall-e-2': { id: 'dall-e-2' },
  },
})

export const openRouter = createModel<
  'OpenRouter',
  Literals<Parameters<OpenRouterProvider>[0]>
>({
  name: 'OpenRouter',
  logo: <OpenRouterLogo />,
  baseURL: 'https://openrouter.ai/api/v1',
  chat: {
    'openai/gpt-oss-20b:free': { id: 'openai/gpt-oss-20b:free' },
  },
})

export const deepSeek = createModel<
  'DeepSeek',
  Literals<Parameters<DeepSeekProvider['chat']>[0]>
>({
  name: 'DeepSeek',
  logo: <DeepSeekLogo />,
  baseURL: 'https://api.deepseek.com/v1',
  chat: {
    'deepseek-chat': { id: 'deepseek-chat' },
    'deepseek-reasoner': { id: 'deepseek-reasoner' },
  },
})

export const xai = createModel<
  'Xai',
  Literals<Parameters<XaiProvider['chat']>[0]>,
  Literals<Parameters<XaiProvider['image']>[0]>
>({
  name: 'Xai',
  logo: <XaiLogo />,
  baseURL: 'https://xai.ai/api/v1',
  chat: {
    'grok-4': { id: 'grok-4' },
    'grok-4-0709': { id: 'grok-4-0709' },
    'grok-4-latest': { id: 'grok-4-latest' },
    'grok-3': { id: 'grok-3' },
    'grok-3-latest': { id: 'grok-3-latest' },
    'grok-3-fast': { id: 'grok-3-fast' },
    'grok-3-fast-latest': { id: 'grok-3-fast-latest' },
    'grok-3-mini': { id: 'grok-3-mini' },
    'grok-3-mini-latest': { id: 'grok-3-mini-latest' },
    'grok-3-mini-fast': { id: 'grok-3-mini-fast' },
    'grok-3-mini-fast-latest': { id: 'grok-3-mini-fast-latest' },
    'grok-2-vision-1212': { id: 'grok-2-vision-1212' },
    'grok-2-vision': { id: 'grok-2-vision' },
    'grok-2-vision-latest': { id: 'grok-2-vision-latest' },
    'grok-2-image-1212': { id: 'grok-2-image-1212' },
    'grok-2-image': { id: 'grok-2-image' },
    'grok-2-image-latest': { id: 'grok-2-image-latest' },
    'grok-2-1212': { id: 'grok-2-1212' },
    'grok-2': { id: 'grok-2' },
    'grok-2-latest': { id: 'grok-2-latest' },
    'grok-vision-beta': { id: 'grok-vision-beta' },
    'grok-beta': { id: 'grok-beta' },
  },
  image: {
    'grok-2-image': { id: 'grok-2-image' },
  },
})

export const vercel = createModel<
  'Vercel',
  Literals<Parameters<VercelProvider>[0]>
>({
  name: 'Vercel',
  logo: <VercelLogo />,
  baseURL: 'https://api.v0.dev/v1',
  chat: {
    'v0-1.0-md': { id: 'v0-1.0-md' },
    'v0-1.5-md': { id: 'v0-1.5-md' },
    'v0-1.5-lg': { id: 'v0-1.5-lg' },
  },
})

export const anthropic = createModel<
  'Anthropic',
  Literals<Parameters<AnthropicProvider>[0]>
>({
  name: 'Anthropic',
  logo: <AnthropicLogo />,
  baseURL: 'https://api.anthropic.com/v1',
  chat: {
    'claude-opus-4-20250514': { id: 'claude-opus-4-20250514' },
    'claude-sonnet-4-20250514': { id: 'claude-sonnet-4-20250514' },
    'claude-3-7-sonnet-20250219': { id: 'claude-3-7-sonnet-20250219' },
    'claude-3-5-sonnet-latest': { id: 'claude-3-5-sonnet-latest' },
    'claude-3-5-sonnet-20241022': { id: 'claude-3-5-sonnet-20241022' },
    'claude-3-5-sonnet-20240620': { id: 'claude-3-5-sonnet-20240620' },
    'claude-3-5-haiku-latest': { id: 'claude-3-5-haiku-latest' },
    'claude-3-5-haiku-20241022': { id: 'claude-3-5-haiku-20241022' },
    'claude-3-opus-latest': { id: 'claude-3-opus-latest' },
    'claude-3-opus-20240229': { id: 'claude-3-opus-20240229' },
    'claude-3-sonnet-20240229': { id: 'claude-3-sonnet-20240229' },
    'claude-3-haiku-20240307': { id: 'claude-3-haiku-20240307' },
  },
})

export const groq = createModel<'Groq', Literals<Parameters<GroqProvider>[0]>>({
  name: 'Groq',
  logo: <GroqLogo />,
  baseURL: 'https://api.groq.com/v1',
  chat: {
    'gemma2-9b-it': { id: 'gemma2-9b-it' },
    'llama-3.1-8b-instant': { id: 'llama-3.1-8b-instant' },
    'llama-3.3-70b-versatile': { id: 'llama-3.3-70b-versatile' },
    'meta-llama/llama-guard-4-12b': { id: 'meta-llama/llama-guard-4-12b' },
    'openai/gpt-oss-120b': { id: 'openai/gpt-oss-120b' },
    'openai/gpt-oss-20b': { id: 'openai/gpt-oss-20b' },
    'deepseek-r1-distill-llama-70b': { id: 'deepseek-r1-distill-llama-70b' },
    'meta-llama/llama-4-maverick-17b-128e-instruct': {
      id: 'meta-llama/llama-4-maverick-17b-128e-instruct',
    },
    'meta-llama/llama-4-scout-17b-16e-instruct': {
      id: 'meta-llama/llama-4-scout-17b-16e-instruct',
    },
    'meta-llama/llama-prompt-guard-2-22m': {
      id: 'meta-llama/llama-prompt-guard-2-22m',
    },
    'meta-llama/llama-prompt-guard-2-86m': {
      id: 'meta-llama/llama-prompt-guard-2-86m',
    },
    'mistral-saba-24b': { id: 'mistral-saba-24b' },
    'moonshotai/kimi-k2-instruct': { id: 'moonshotai/kimi-k2-instruct' },
    'qwen/qwen3-32b': { id: 'qwen/qwen3-32b' },
    'llama-guard-3-8b': { id: 'llama-guard-3-8b' },
    'llama3-70b-8192': { id: 'llama3-70b-8192' },
    'llama3-8b-8192': { id: 'llama3-8b-8192' },
    'mixtral-8x7b-32768': { id: 'mixtral-8x7b-32768' },
    'qwen-qwq-32b': { id: 'qwen-qwq-32b' },
    'qwen-2.5-32b': { id: 'qwen-2.5-32b' },
    'deepseek-r1-distill-qwen-32b': { id: 'deepseek-r1-distill-qwen-32b' },
  },
})

export const google = createModel<
  'Google',
  Literals<Parameters<GoogleGenerativeAIProvider['chat']>[0]>,
  Literals<Parameters<GoogleGenerativeAIProvider['image']>[0]>
>({
  name: 'Google',
  logo: <GoogleLogo />,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  chat: {
    'gemini-1.5-flash': { id: 'gemini-1.5-flash' },
    'gemini-1.5-flash-latest': { id: 'gemini-1.5-flash-latest' },
    'gemini-1.5-flash-001': { id: 'gemini-1.5-flash-001' },
    'gemini-1.5-flash-002': { id: 'gemini-1.5-flash-002' },
    'gemini-1.5-flash-8b': { id: 'gemini-1.5-flash-8b' },
    'gemini-1.5-flash-8b-latest': { id: 'gemini-1.5-flash-8b-latest' },
    'gemini-1.5-flash-8b-001': { id: 'gemini-1.5-flash-8b-001' },
    'gemini-1.5-pro': { id: 'gemini-1.5-pro' },
    'gemini-1.5-pro-latest': { id: 'gemini-1.5-pro-latest' },
    'gemini-1.5-pro-001': { id: 'gemini-1.5-pro-001' },
    'gemini-1.5-pro-002': { id: 'gemini-1.5-pro-002' },
    'gemini-2.0-flash': { id: 'gemini-2.0-flash' },
    'gemini-2.0-flash-001': { id: 'gemini-2.0-flash-001' },
    'gemini-2.0-flash-live-001': { id: 'gemini-2.0-flash-live-001' },
    'gemini-2.0-flash-lite': { id: 'gemini-2.0-flash-lite' },
    'gemini-2.0-pro-exp-02-05': { id: 'gemini-2.0-pro-exp-02-05' },
    'gemini-2.0-flash-thinking-exp-01-21': {
      id: 'gemini-2.0-flash-thinking-exp-01-21',
    },
    'gemini-2.0-flash-exp': { id: 'gemini-2.0-flash-exp' },
    'gemini-2.5-pro': { id: 'gemini-2.5-pro' },
    'gemini-2.5-flash': { id: 'gemini-2.5-flash' },
    'gemini-2.5-flash-lite': { id: 'gemini-2.5-flash-lite' },
    'gemini-2.5-pro-exp-03-25': { id: 'gemini-2.5-pro-exp-03-25' },
    'gemini-2.5-flash-preview-04-17': { id: 'gemini-2.5-flash-preview-04-17' },
    'gemini-exp-1206': { id: 'gemini-exp-1206' },
    'gemma-3-12b-it': { id: 'gemma-3-12b-it' },
    'gemma-3-27b-it': { id: 'gemma-3-27b-it' },
  },
  image: {
    'imagen-3.0-generate-002': { id: 'imagen-3.0-generate-002' },
  },
})

export const Models = {
  OpenAI: openai,
  OpenRouter: openRouter,
  DeepSeek: deepSeek,
  Xai: xai,
  Vercel: vercel,
  Anthropic: anthropic,
  Groq: groq,
  Google: google,
} as const

export type ModelName = (typeof Models)[keyof typeof Models]['name']

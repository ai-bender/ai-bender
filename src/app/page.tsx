/* eslint-disable react/no-array-index-key */
'use client'
import { useChat } from '@ai-sdk/react'
import { createEneo } from 'eneo'
import { useAtomValue } from 'jotai/react'
import { Fragment, useState } from 'react'
import { toast } from 'sonner'
import { modelsSettingsAtom } from '~/atoms/models-settings'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '~/components/ai-elements/conversation'
import { Loader } from '~/components/ai-elements/loader'
import { Message, MessageContent } from '~/components/ai-elements/message'
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '~/components/ai-elements/prompt-input'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '~/components/ai-elements/reasoning'
import { Response } from '~/components/ai-elements/response'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '~/components/ai-elements/source'
import { Models } from './components/models'
import type { EneoReturn } from 'eneo'
import type { ModelType } from '~/atoms/models-settings'
import type { WorkerFunctions } from '~/worker'

export default function Page() {
  const rpc = useRef<EneoReturn<WorkerFunctions>>(null)
  const [input, setInput] = useState('')
  const modelsSettings = useAtomValue(modelsSettingsAtom)
  const currentModel = modelsSettings.models.find(
    (m) => m.id === modelsSettings.id,
  )

  const { messages, sendMessage, status } = useChat({
    transport: {
      sendMessages: async (options) => {
        const iter = rpc.current?.chat.asAsyncIter({
          messages: options.messages,
          body: options.body as {
            model: string
            apiKey: string
            baseURL?: string
            type: ModelType
          },
        })
        if (!iter) {
          throw new Error('worker not initialized')
        }

        return new ReadableStream({
          async pull(controller) {
            const { done, value } = await iter.next()

            if (done) {
              controller.close()
            } else {
              controller.enqueue(value)
            }
          },
          async cancel() {
            await iter.return?.()
          },
        })
      },
      reconnectToStream: async () => {
        throw new Error('Unsupported')
      },
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentModel?.apiKey.trim()) {
      toast.error('Please enter an API key', {
        description: 'You can get one from OpenRouter',
      })
      return
    }

    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            model: currentModel.model,
            apiKey: currentModel.apiKey,
            baseURL: currentModel.baseURL,
            type: currentModel.type,
          },
        },
      )
      setInput('')
    }
  }

  useEffect(() => {
    const worker = new Worker(new URL('../worker/index.ts', import.meta.url))

    rpc.current = createEneo(
      {},
      {
        post: (data) => worker.postMessage(data),
        // eslint-disable-next-line react-web-api/no-leaked-event-listener
        on: (fn) => worker.addEventListener('message', fn),
        off: (fn) => worker.removeEventListener('message', fn),
        deserialize: (e) => e.data,
      },
    )

    const cleanup = () => {
      rpc.current?.$close()
      worker.terminate()
    }

    return () => {
      cleanup()
    }
  }, [])

  return (
    <div className='relative mx-auto size-full h-screen max-w-4xl p-6'>
      <Models />

      <div className='flex h-full flex-col'>
        <Conversation className='h-full'>
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' && (
                  <Sources>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case 'source-url':
                          return (
                            <Fragment key={`${message.id}-${i}`}>
                              <SourcesTrigger
                                count={
                                  message.parts.filter(
                                    (part) => part.type === 'source-url',
                                  ).length
                                }
                              />
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            </Fragment>
                          )
                        default:
                          return null
                      }
                    })}
                  </Sources>
                )}
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          )
                        case 'reasoning':
                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className='w-full'
                              isStreaming={status === 'streaming'}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          )
                        default:
                          return null
                      }
                    })}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className='mt-4'>
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar className='justify-end'>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  )
}

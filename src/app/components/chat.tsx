/* eslint-disable react/no-array-index-key */
'use client'
import { useChat } from '@ai-sdk/react'
import { useLiveQuery } from 'dexie-react-hooks'
import { createEneo } from 'eneo'
import { useAtom } from 'jotai/react'
import { Link2Icon, PlusIcon, TrashIcon } from 'lucide-react'
import { Fragment, useState } from 'react'
import { toast } from 'sonner'
import { syncInputAtom } from '~/atoms/sync-input'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '~/components/ai-elements/conversation'
import { Loader } from '~/components/ai-elements/loader'
import { Message, MessageContent } from '~/components/ai-elements/message'
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
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
} from '~/components/ai-elements/sources'
import { Button } from '~/components/ui/button'
import { inputEmitter } from '~/events/input'
import { useMemoizedFn } from '~/hooks/use-memoized-fn'
import type { EneoReturn } from 'eneo'
import type { Chat as IChat } from '~/db'
import type { ModelName } from '~/models'
import type { WorkerFunctions } from '~/worker'

export function Chat({
  chat,
  showDelete = true,
}: {
  chat: IChat
  showDelete: boolean
}) {
  const models = useLiveQuery(() => db.models.toArray(), [], [])
  const model = useLiveQuery(() => {
    if (!chat.modelId) return undefined
    return db.models.get(chat.modelId)
  }, [chat.modelId])

  const rpc = useRef<EneoReturn<WorkerFunctions>>(null)
  const [enableSync, setEnableSync] = useState(true)
  const [syncInput, setSyncInput] = useAtom(syncInputAtom)

  const [input, _setInput] = useState('')
  const setInput = useCallback(
    (value: string) => {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      _setInput(value)

      if (enableSync) {
        setSyncInput(value)
      }
    },
    [enableSync, setSyncInput],
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
            type: ModelName
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

  const handleSubmit = useMemoizedFn(() => {
    if (!model?.apiKey.trim()) {
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
            model: model.model,
            apiKey: model.apiKey,
            baseURL: model.baseURL,
            type: model.type,
          },
        },
      )
      setInput('')
    }
  })

  const setModel = async (modelId: number) => {
    await db.chats.update(chat.id, { modelId })
  }

  const addChat = async () => {
    await db.chats.add({ modelId: null, messages: [] })
  }

  const deleteChat = async () => {
    await db.chats.delete(chat.id)
  }

  useEffect(() => {
    const worker = new Worker(new URL('../../worker/index.ts', import.meta.url))

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

  useEffect(() => {
    if (enableSync) {
      setInput(syncInput)
    }
  }, [syncInput, enableSync, setInput])

  useEffect(() => {
    const unbind = inputEmitter.on('submit', () => {
      if (enableSync) handleSubmit()
    })

    return () => {
      unbind()
    }
  }, [handleSubmit, enableSync])

  return (
    <div className='flex h-full flex-col'>
      <div className='flex justify-end'>
        {showDelete && (
          <Button variant='ghost' size='icon' onClick={deleteChat}>
            <TrashIcon />
          </Button>
        )}
        <Button variant='ghost' size='icon' onClick={addChat}>
          <PlusIcon />
        </Button>
      </div>

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

      <PromptInput
        onSubmit={(e) => {
          e.preventDefault()
          if (enableSync) {
            inputEmitter.emit('submit')
          } else {
            handleSubmit()
          }
        }}
        className='mt-4'
      >
        <PromptInputTextarea
          placeholder='Type your message here...'
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <PromptInputToolbar className=''>
          <PromptInputTools>
            <PromptInputModelSelect
              onValueChange={(value) => {
                if (!value) return
                setModel(Number(value))
              }}
              value={model?.id.toString()}
            >
              <PromptInputModelSelectTrigger className='min-w-24'>
                <PromptInputModelSelectValue placeholder='Select a model' />
              </PromptInputModelSelectTrigger>
              {models.length > 0 && (
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem
                      key={model.id}
                      value={model.id.toString()}
                    >
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              )}
            </PromptInputModelSelect>
            <PromptInputButton
              variant={enableSync ? 'default' : 'ghost'}
              onClick={() => setEnableSync(!enableSync)}
            >
              <Link2Icon size={16} />
              <span>Synced</span>
            </PromptInputButton>
          </PromptInputTools>

          <PromptInputSubmit disabled={!input} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  )
}

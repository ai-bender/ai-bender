'use client'
import { useLiveQuery } from 'dexie-react-hooks'
import Link from 'next/link'
import { Fragment } from 'react'
import { SiGithub } from 'react-icons/si'
import { Chat } from '~/app/components/chat'
import { buttonVariants } from '~/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable'
import { ModelsDialog } from './components/models-dialog'
import type { Chat as IChat } from '~/db'

export default function Page() {
  const chats = useLiveQuery<IChat[], IChat[]>(() => db.chats.toArray(), [], [])

  return (
    <div className='relative mx-auto flex size-full overflow-hidden'>
      <div className='border-border flex flex-col justify-between border-r p-2'>
        <ModelsDialog />
        <Link
          target='_blank'
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          href='https://github.com/ai-bender/ai-bender'
        >
          <SiGithub />
          <span className='sr-only'>github repo link</span>
        </Link>
      </div>

      <div className='w-[calc(100%-52px)] overflow-x-auto p-2'>
        <div
          className='flex h-full min-w-full'
          style={{
            width: `${chats.length * 550}px`,
          }}
        >
          <ResizablePanelGroup
            direction='horizontal'
            className='border-border rounded border'
          >
            {chats.map((chat, index) => (
              <Fragment key={chat.id}>
                {index !== 0 && (
                  <ResizableHandle withHandle className='border-border' />
                )}
                <ResizablePanel
                  key={chat.id}
                  className='p-2'
                  defaultSize={chats.length / 100}
                  style={{
                    minWidth: '380px',
                  }}
                >
                  <Chat chat={chat} showDelete={chats.length > 1} />
                </ResizablePanel>
              </Fragment>
            ))}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}

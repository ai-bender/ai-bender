import Link from 'next/link'
import { SiGithub } from 'react-icons/si'
import { Chat } from '~/components/chat'
import { buttonVariants } from '~/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable'
import { ModelsDialog } from './components/models-dialog'

export default function Page() {
  return (
    <div className='relative mx-auto flex size-full h-screen'>
      <div className='flex flex-col justify-between py-2 pl-2'>
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

      <div className='flex-1 p-2'>
        <ResizablePanelGroup
          direction='horizontal'
          className='border-border rounded border'
        >
          <ResizablePanel className='p-2' defaultSize={50}>
            <Chat />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className='p-2' defaultSize={50}>
            <Chat />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

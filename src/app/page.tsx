import { Chat } from '~/components/chat'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable'
import { Models } from './components/models'

export default function Page() {
  return (
    <div className='relative mx-auto flex size-full h-screen'>
      <Models />

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

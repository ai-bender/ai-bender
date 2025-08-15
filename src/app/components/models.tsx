import { useAtom } from 'jotai/react'
import { SettingsIcon } from 'lucide-react'
import { openrouterAtom } from '~/atoms/openrouter'
import { Button } from '~/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export const Models = () => {
  const [openrouter, setOpenrouter] = useAtom(openrouterAtom)

  return (
    <div className='fixed top-2 left-2 flex flex-col items-start gap-2'>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='outline' size='icon'>
            <SettingsIcon className='size-4' />
          </Button>
        </DrawerTrigger>

        <DrawerContent className='min-h-1/2 px-10'>
          <DrawerHeader>
            <DrawerTitle>OpenRouter Settings</DrawerTitle>
          </DrawerHeader>

          <div className='flex flex-col gap-2'>
            <div className='flex flex-col items-start gap-2'>
              <Label htmlFor='base-url'>Base URL</Label>
              <Input
                type='text'
                id='base-url'
                placeholder='https://openrouter.ai/api/v1'
                value={openrouter.baseURL}
                onChange={(e) =>
                  setOpenrouter({ ...openrouter, baseURL: e.target.value })
                }
              />
            </div>
            <div className='flex flex-col items-start gap-2'>
              <Label htmlFor='api-key'>API Key</Label>
              <Input
                type='password'
                id='api-key'
                placeholder='API Key'
                value={openrouter.apiKey}
                onChange={(e) =>
                  setOpenrouter({ ...openrouter, apiKey: e.target.value })
                }
              />
            </div>
            <div className='flex flex-col items-start gap-2'>
              <Label htmlFor='model'>Model</Label>
              <Input
                type='text'
                id='model'
                placeholder='openai/gpt-oss-20b:free'
                value={openrouter.model}
                onChange={(e) =>
                  setOpenrouter({ ...openrouter, model: e.target.value })
                }
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

import { useAtom } from 'jotai/react'
import { PlusIcon, SettingsIcon } from 'lucide-react'
import { useState } from 'react'
import {
  defaultModel,
  modelsSettingsAtom,
  modelTypes,
} from '~/atoms/models-settings'
import { Button } from '~/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { Model, ModelType } from '~/atoms/models-settings'

export const Models = () => {
  const [modelsSettings, setModelsSettings] = useAtom(modelsSettingsAtom)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newModel, setNewModel] = useState<Omit<Model, 'id'>>({
    type: modelTypes.OpenRouter,
    name: '',
    baseURL: '',
    apiKey: '',
    model: '',
  })

  const setNameById = (id: number, name: string) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, name } : m,
      ),
    })
  }

  const setBaseURLById = (id: number, baseURL: string) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, baseURL } : m,
      ),
    })
  }

  const setApiKeyById = (id: number, apiKey: string) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, apiKey } : m,
      ),
    })
  }

  const setModelById = (id: number, model: string) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, model } : m,
      ),
    })
  }

  const setTypeById = (id: number, type: ModelType) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, type } : m,
      ),
    })
  }

  const addModel = () => {
    const newModelWithId = {
      ...defaultModel,
      id: new Date().getTime(),
      name: newModel.name || `Model ${modelsSettings.models.length + 1}`,
      baseURL: newModel.baseURL,
      apiKey: newModel.apiKey,
      model: newModel.model,
    }
    setModelsSettings({
      ...modelsSettings,
      id: newModelWithId.id,
      models: [...modelsSettings.models, newModelWithId],
    })
    // Reset form
    setNewModel({
      name: '',
      baseURL: '',
      type: modelTypes.OpenRouter,
      apiKey: '',
      model: '',
    })
    setIsDialogOpen(false)
  }

  const enableModel = (id: number) => {
    setModelsSettings({
      ...modelsSettings,
      id,
    })
  }

  return (
    <div className='fixed top-2 left-2 flex flex-col items-start gap-2'>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' size='icon'>
            <PlusIcon className='size-4' />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                value={newModel.name}
                onChange={(e) =>
                  setNewModel({ ...newModel, name: e.target.value })
                }
                placeholder='Model Name'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='type' className='text-right'>
                Type
              </Label>
              <Select
                value={newModel.type}
                onValueChange={(value) =>
                  setNewModel({
                    ...newModel,
                    type: value as ModelType,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a type' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(modelTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='base-url' className='text-right'>
                Base URL
              </Label>
              <Input
                id='base-url'
                value={newModel.baseURL}
                onChange={(e) =>
                  setNewModel({ ...newModel, baseURL: e.target.value })
                }
                placeholder='https://openrouter.ai/api/v1'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='api-key' className='text-right'>
                API Key
              </Label>
              <Input
                id='api-key'
                type='password'
                value={newModel.apiKey}
                onChange={(e) =>
                  setNewModel({ ...newModel, apiKey: e.target.value })
                }
                placeholder='API Key'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='model' className='text-right'>
                Model
              </Label>
              <Input
                id='model'
                value={newModel.model}
                onChange={(e) =>
                  setNewModel({ ...newModel, model: e.target.value })
                }
                placeholder='openai/gpt-oss-20b:free'
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' onClick={addModel}>
              Add Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='outline' size='icon'>
            <SettingsIcon className='size-4' />
          </Button>
        </DrawerTrigger>

        <DrawerContent className='min-h-2/3 px-10'>
          <DrawerHeader className='relative'>
            <DrawerTitle>Settings</DrawerTitle>
          </DrawerHeader>

          <div className='px-10'>
            <Carousel className='px-10'>
              <CarouselContent>
                {modelsSettings.models.map((model) => (
                  <CarouselItem key={model.id} className='relative'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <Label htmlFor='model'>Enable</Label>
                        <Checkbox
                          checked={modelsSettings.id === model?.id}
                          onCheckedChange={(checked) => {
                            if (checked) enableModel(model.id)
                          }}
                        />
                      </div>

                      <div className='flex flex-col items-start gap-2'>
                        <Label htmlFor='name'>Name</Label>
                        <Input
                          type='text'
                          id='name'
                          placeholder='Model Name'
                          value={model.name}
                          onChange={(e) =>
                            setNameById(model.id, e.target.value)
                          }
                        />
                      </div>
                      <div className='flex flex-col items-start gap-2'>
                        <Label htmlFor='type'>Type</Label>
                        <Select
                          value={model.type}
                          onValueChange={(value) =>
                            setTypeById(model.id, value as ModelType)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select a type' />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(modelTypes).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='flex flex-col items-start gap-2'>
                        <Label htmlFor='base-url'>Base URL</Label>
                        <Input
                          type='text'
                          id='base-url'
                          placeholder='https://openrouter.ai/api/v1'
                          value={model.baseURL}
                          onChange={(e) =>
                            setBaseURLById(model.id, e.target.value)
                          }
                        />
                      </div>
                      <div className='flex flex-col items-start gap-2'>
                        <Label htmlFor='api-key'>API Key</Label>
                        <Input
                          type='password'
                          id='api-key'
                          placeholder='API Key'
                          value={model.apiKey}
                          onChange={(e) =>
                            setApiKeyById(model.id, e.target.value)
                          }
                        />
                      </div>
                      <div className='flex flex-col items-start gap-2'>
                        <Label htmlFor='model'>Model</Label>
                        <Input
                          type='text'
                          id='model'
                          placeholder='openai/gpt-oss-20b:free'
                          value={model.model}
                          onChange={(e) =>
                            setModelById(model.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

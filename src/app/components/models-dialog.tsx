'use client'
import { useAtom } from 'jotai/react'
import { CopyIcon, PlusIcon, SettingsIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { defaultModel, modelsSettingsAtom } from '~/atoms/models-settings'
import { Button } from '~/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'
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
import { Models } from '~/models'
import type { Model } from '~/atoms/models-settings'
import type { ModelName } from '~/models'

export const ModelsDialog = () => {
  const [modelsSettings, setModelsSettings] = useAtom(modelsSettingsAtom)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newModel, setNewModel] = useState<Omit<Model, 'id'>>({
    type: Models.OpenRouter.name,
    name: '',
    baseURL: '',
    apiKey: '',
    model: '',
  })

  const setNameById = (id: string, name: string) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, name } : m,
      ),
    })
  }

  const setBaseURLById = (id: string, baseURL: string) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, baseURL } : m,
      ),
    })
  }

  const setApiKeyById = (id: string, apiKey: string) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, apiKey } : m,
      ),
    })
  }

  const setModelById = (id: string, model: string) => {
    setModelsSettings({
      ...modelsSettings,
      models: modelsSettings.models.map((m) =>
        m.id === id ? { ...m, model } : m,
      ),
    })
  }

  const setTypeById = (id: string, type: ModelName) => {
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
      id: new Date().getTime().toString(),
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
      type: Models.OpenRouter.name,
      apiKey: '',
      model: '',
    })
    setIsDialogOpen(false)
  }

  const deleteModel = (id: string) => {
    const willDeleteModel = modelsSettings.models.find((m) => m.id === id)

    const newModels = modelsSettings.models.filter((m) => m.id !== id)
    setModelsSettings({
      ...modelsSettings,
      models: newModels,
      id: newModels.length === 0 ? undefined : newModels[0].id,
    })

    toast(`${willDeleteModel?.name} deleted`, {
      position: 'top-right',
      action: {
        label: 'Undo',
        onClick: () => {
          willDeleteModel &&
            setModelsSettings((prev) => ({
              ...prev,
              models: [...prev.models, willDeleteModel],
            }))
        },
      },
    })
  }

  const copyModel = (id: string) => {
    const model = modelsSettings.models.find((m) => m.id === id)
    if (!model) return

    setModelsSettings((prev) => ({
      ...prev,
      models: [
        ...prev.models,
        { ...model, id: new Date().getTime().toString() },
      ],
    }))

    toast('Model copied', {
      position: 'top-right',
    })
  }

  return (
    <div className='flex flex-col items-start gap-2 pt-2 pl-2'>
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
                    type: value as ModelName,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a type' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(Models).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
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
            {modelsSettings.models.length ? (
              <Carousel
                className='px-10'
                opts={{
                  startIndex: modelsSettings.models.findIndex(
                    (m) => m.id === modelsSettings.id,
                  ),
                }}
              >
                <CarouselContent>
                  {modelsSettings.models.map((model) => (
                    <CarouselItem key={model.id} className='relative'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex flex-col items-start gap-2'>
                          <Label htmlFor={`${model.id}-name`}>Name</Label>
                          <Input
                            type='text'
                            id={`${model.id}-name`}
                            placeholder='Model Name'
                            value={model.name}
                            onChange={(e) =>
                              setNameById(model.id, e.target.value)
                            }
                          />
                        </div>
                        <div className='flex flex-col items-start gap-2'>
                          <Label htmlFor={`${model.id}-type`}>Type</Label>
                          <Select
                            value={model.type}
                            onValueChange={(value) =>
                              setTypeById(model.id, value as ModelName)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select a type' />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(Models).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='flex flex-col items-start gap-2'>
                          <Label htmlFor={`${model.id}-base-url`}>
                            Base URL
                          </Label>
                          <Input
                            type='text'
                            id={`${model.id}-base-url`}
                            placeholder='https://openrouter.ai/api/v1'
                            value={model.baseURL}
                            onChange={(e) =>
                              setBaseURLById(model.id, e.target.value)
                            }
                          />
                        </div>
                        <div className='flex flex-col items-start gap-2'>
                          <Label htmlFor={`${model.id}-api-key`}>API Key</Label>
                          <Input
                            type='password'
                            id={`${model.id}-api-key`}
                            placeholder='API Key'
                            value={model.apiKey}
                            onChange={(e) =>
                              setApiKeyById(model.id, e.target.value)
                            }
                          />
                        </div>
                        <div className='flex flex-col items-start gap-2'>
                          <Label htmlFor={`${model.id}-model`}>Model</Label>
                          <Input
                            type='text'
                            id={`${model.id}-model`}
                            placeholder='openai/gpt-oss-20b:free'
                            value={model.model}
                            onChange={(e) =>
                              setModelById(model.id, e.target.value)
                            }
                          />
                        </div>

                        <div className='flex items-center justify-end gap-2'>
                          <div className='flex items-center justify-end gap-2'>
                            <Button
                              variant='destructive'
                              size='icon'
                              onClick={() => deleteModel(model.id)}
                            >
                              <TrashIcon className='size-4' />
                            </Button>
                          </div>
                          <div className='flex items-center justify-end gap-2'>
                            <Button
                              variant='outline'
                              size='icon'
                              onClick={() => copyModel(model.id)}
                            >
                              <CopyIcon className='size-4' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className='flex flex-col items-center justify-center gap-2 text-base'>
                <p>No models found</p>
                <p>Add a model to get started</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

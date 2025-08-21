import { createNanoEvents } from 'nanoevents'

export const inputEmitter = createNanoEvents<{
  submit: () => void
}>()

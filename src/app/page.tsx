'use client'
import { ThemeSwitcher } from '~/components/theme-switcher'
import { isBrowser } from '~/lib/is-browser'
import Counter from './components/counter'

export default function Home() {
  const worker = useRef<Worker | null>(
    isBrowser
      ? new Worker(new URL('../worker/index.ts', import.meta.url))
      : null,
  )

  useEffect(() => {
    if (worker.current) {
      worker.current.postMessage('hello')
    }
  }, [])

  return (
    <main className='flex h-full flex-col items-center justify-center gap-y-4'>
      <motion.div
        className='size-16 rounded-md border bg-blue-600'
        whileHover={{ scale: 1.1, rotate: '360deg' }}
      />
      <Counter />

      <ThemeSwitcher />
    </main>
  )
}

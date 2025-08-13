import { domMax, LazyMotion } from 'motion/react'
import { ThemeProvider } from 'next-themes'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <LazyMotion strict features={domMax}>
        {children}
      </LazyMotion>
    </ThemeProvider>
  )
}

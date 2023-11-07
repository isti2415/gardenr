import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/theme-toggle-btn'
import '@/styles/globals.css'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { Toaster } from '@/components/ui/toaster'


export default function App({ Component, pageProps }) {

  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="fixed bottom-4 left-4 z-10">
          <ModeToggle />
        </div>
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionContextProvider>
  )
}

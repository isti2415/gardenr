import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle-btn";
import "@/styles/globals.css";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main className={`${urbanist.variable} font-sans scroll-smooth`}>
          <div className="fixed bottom-4 left-4 z-20">
            <ModeToggle />
          </div>
          <Toaster />
          <Component {...pageProps} className="font-sans" />
        </main>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

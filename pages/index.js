
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className='md:ml-64'>
        <h1 className='text-4xl font-bold'>Next.js + Tailwind CSS</h1>
      </div>
    </main>
  )
}

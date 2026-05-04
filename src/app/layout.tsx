import type { Metadata, Viewport } from 'next'
import { Inter, Newsreader, JetBrains_Mono, Spectral } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-newsreader',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const spectral = Spectral({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spectral-var',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anchor — Life Planner',
  description: 'A quiet, paper-planner-inspired life management app.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Anchor',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F5F1E8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="ochre"
      data-mode="light"
      data-density="spacious"
      data-typeface="newsreader"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} ${spectral.variable} h-full`}
    >
      <body className="h-full bg-paper text-ink font-body antialiased">
        {children}
      </body>
    </html>
  )
}

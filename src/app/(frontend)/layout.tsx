import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import './styles.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/use-auth'
import QueryClientProvider from './dashboard/components/QueryClientProvider'

const font = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Family Gifts',
  description: 'Simplify Family Gift-Giving',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <QueryClientProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  )
}

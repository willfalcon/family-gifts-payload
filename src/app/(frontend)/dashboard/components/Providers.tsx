'use client'

import { PropsWithChildren } from 'react'

import { BreadcrumbsProvider } from '@/components/HeaderBreadcrumbs'

import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from 'next-themes'
import QueryClientProvider from './QueryClientProvider'

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BreadcrumbsProvider>
        <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
      </BreadcrumbsProvider>
    </ThemeProvider>
  )
}

import type { Metadata } from 'next'
import '../styles/globals.css'
import React from 'react'
import Navigation from './components/Navigation'

export const metadata: Metadata = {
  title: 'PMP Sim Idle',
  description: 'PMP Sim Idle - A unique idle game that helps you learn project management knowledge through engaging gameplay. Enhance your project management skills by managing virtual projects, allocating resources, and making strategic decisions.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="bg-background text-foreground">
        <Navigation />
      </body>
    </html>
  )
}
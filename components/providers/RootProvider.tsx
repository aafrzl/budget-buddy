'use client'

import React from 'react'
import { ThemeProvider } from './ThemeProvider'

export default function RootProviders({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

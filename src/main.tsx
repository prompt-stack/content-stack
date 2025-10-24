/**
 * @file main.tsx
 * @purpose [TODO: Add purpose]
 * @layer unknown
 * @deps [App, layout/Layout, pages/HealthPage, pages/InboxPage, pages/PlaygroundPage, pages/SubscriptionPage]
 * @used-by none
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { Layout } from './layout/Layout'
import { InboxPage } from './pages/InboxPage'
import HealthPage from './pages/HealthPage'
import SubscriptionPage from './pages/SubscriptionPage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { StoragePage } from './pages/StoragePage'
import { SearchPage } from './pages/SearchPage'
import { TestSidebarPage } from './pages/TestSidebarPage'
import { StudioPage } from './pages/StudioPage'
import { SettingsPage } from './pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: 'health',
        element: <HealthPage />
      },
      {
        path: 'subscription',
        element: <SubscriptionPage />
      },
      {
        path: 'playground',
        element: <PlaygroundPage />
      },
      {
        path: 'storage',
        element: <StoragePage />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'studio',
        element: <StudioPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  // Pages with their own layouts (no main Layout wrapper)
  {
    path: '/inbox',
    element: <InboxPage />
  },
  {
    path: '/test-sidebar',
    element: <TestSidebarPage />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  </StrictMode>,
)

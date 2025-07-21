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
        path: 'inbox',
        element: <InboxPage />
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
      }
    ]
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

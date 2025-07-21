/**
 * @layer layout
 * @description Root layout wrapper for the application
 * @dependencies Header (layout)
 * @cssFile Uses global layout styles
 * @className .layout
 * 
 * This is a LAYOUT component that provides the overall page structure
 * with header and main content area using React Router's Outlet.
 */

import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
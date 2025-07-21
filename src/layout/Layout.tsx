/**
 * @file layout/Layout.tsx
 * @purpose Root layout wrapper for the application
 * @layer layout
 * @deps Header (layout)
 * @used-by [ButtonPlayground, CardPlayground, CompositionPlayground, FormPlayground, InboxPlayground, LayoutPlayground, ModalPlayground, PlaygroundPage, UtilityPlayground, main]
 * @css Usesgloballayoutstyles
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
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

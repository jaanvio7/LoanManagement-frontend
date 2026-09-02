import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SubadminSidebar from './SubadminSidebar.jsx'
import SubadminTopbar from './SubadminTopbar.jsx'

export default function SubadminMaster() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className={`scrim ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      <SubadminSidebar open={sidebarOpen} onLinkClick={() => setSidebarOpen(false)} />

      <div className="main-col">
        <SubadminTopbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

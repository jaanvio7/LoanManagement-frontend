import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'
import AdminTopbar from './AdminTopbar.jsx'

export default function AdminMaster() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className={`scrim ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      <AdminSidebar open={sidebarOpen} onLinkClick={() => setSidebarOpen(false)} />

      <div className="main-col">
        <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Store/auth.js'
import { toast } from 'react-toastify'

// Maps a route to a heading. Lives here because the topbar is the only
// thing that needs it - pages don't need to hand their title down to us.
const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/subadmins': 'Add & Manage Subadmins',
  '/admin/workers': 'View Workers',
  '/admin/loans': 'View Loans',
}

function titleFor(pathname) {
  return PAGE_TITLES[pathname] || 'LedgerFlow'
}

export default function AdminTopbar({ onOpenSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleLogout() {
   localStorage.removeItem('adminId')
   localStorage.removeItem('token')
   localStorage.removeItem('userType')
   logout()  // <-- sync the auth store
   toast.success('Logged out successfully')
    navigate('/login')
  }

  const initials = (user?.name || 'U').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-soft-icon sidebar-toggle-btn" onClick={onOpenSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <span className="topbar-title">{titleFor(pathname)}</span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-soft-icon d-none d-sm-inline-flex">
          <i className="bi bi-bell"></i>
        </button>
        <div className="dropdown">
          <button
            className="btn d-flex align-items-center gap-2 border-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ background: 'transparent' }}
          >
            <div className="avatar-circle">{initials}</div>
            <div className="d-none d-md-block text-start">
              <div style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--navy-900)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>Owner</div>
            </div>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            <li><span className="dropdown-item-text small text-secondary">Signed in as {user?.name}</span></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

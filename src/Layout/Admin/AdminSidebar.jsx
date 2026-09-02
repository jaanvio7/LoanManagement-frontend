import React from 'react'
import { NavLink } from 'react-router-dom'

const navSections = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2', end: true }],
  },
  {
    label: 'Access Control',
    items: [{ to: '/admin/subadmins', label: 'Add & Manage Subadmins', icon: 'bi-person-badge' },
      { to: '/admin/role', label: 'Add & Manage Roles', icon: 'bi-shield-lock' },
      { to: '/admin/worker', label: 'Add & Manage Workers', icon: 'bi-person' }
    ],
  },
  {
    label: 'Read Only',
    items: [
      { to: '/admin/workers', label: 'View Workers', icon: 'bi-people' },
      { to: '/admin/loans', label: 'View Loans', icon: 'bi-cash-coin' },
    ],
  },

]

// Only takes what it needs to open/close on mobile - the nav items
// themselves live here, not passed in from anywhere.
export default function AdminSidebar({ open, onLinkClick }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">LF</div>
        <div>
          <div className="sidebar-brand-text">LedgerFlow</div>
          <div className="sidebar-brand-sub">Admin Panel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onLinkClick}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <i className="bi bi-shield-check me-1"></i> Firm access: Gaba · Gold Line
      </div>
    </aside>
  )
}

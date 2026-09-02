import React from 'react'
import { NavLink } from 'react-router-dom'

const navSections = [
  {
    label: 'Overview',
    items: [{ to: '/subadmin', label: 'Dashboard', icon: 'bi-grid-1x2', end: true }],
  },
  {
    label: 'Lending',
    items: [
      { to: '/subadmin/loans', label: 'Manage Loans', icon: 'bi-cash-coin' },
      { to: '/subadmin/penalty', label: 'Penalty Management', icon: 'bi-exclamation-diamond' },
      { to: '/subadmin/borrowers', label: 'Borrower Profiles', icon: 'bi-person-vcard' },
      { to: '/subadmin/loantype', label: 'Loan Type Management', icon: 'bi-credit-card' },
    ],
  },
  
  {
    label: 'Operations',
    items: [
      { to: '/subadmin/subadmin-worker', label: 'Worker — Add & Manage', icon: 'bi-person' },
  
      { to: '/subadmin/noc', label: 'NOC — Add & Manage', icon: 'bi-file-earmark-check' },
      { to: '/subadmin/case-close', label: 'Case Close Requests', icon: 'bi-check2-square' },
      { to: '/subadmin/deposits', label: 'Deposit Requests', icon: 'bi-safe' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { to: '/subadmin/reports/profit', label: 'Profit Report', icon: 'bi-graph-up-arrow' },
      { to: '/subadmin/reports/defaulters', label: 'Defaulter Report', icon: 'bi-flag' },
    ],
  },
]

export default function SubadminSidebar({ open, onLinkClick }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">LF</div>
        <div>
          <div className="sidebar-brand-text">LedgerFlow</div>
          <div className="sidebar-brand-sub">Subadmin Panel</div>
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

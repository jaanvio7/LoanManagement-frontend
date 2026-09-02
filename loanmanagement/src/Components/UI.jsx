import React, { useEffect } from 'react'

export function StatCard({ label, value, icon, accent = 'gold' }) {
  const accentMap = {
    gold: { c: 'var(--gold)', s: 'var(--gold-soft)' },
    emerald: { c: 'var(--emerald)', s: 'var(--emerald-soft)' },
    rose: { c: 'var(--rose)', s: 'var(--rose-soft)' },
    navy: { c: 'var(--navy-700)', s: '#e7ecf3' },
  }
  const a = accentMap[accent] || accentMap.gold
  return (
    <div className="stat-card h-100" style={{ '--accent': a.c, '--accent-soft': a.s }}>
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <div className="stat-card-label">{label}</div>
          <div className="stat-card-value">{value}</div>
        </div>
        <div className="stat-card-icon">
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  )
}

export function FlagPill({ flag }) {
  const map = {
    green: { cls: 'pill-green', text: 'Green · 1–2 Day' },
    yellow: { cls: 'pill-yellow', text: 'Yellow · Under 1 Wk' },
    red: { cls: 'pill-red', text: 'Red · Over 1 Wk' },
  }
  const f = map[flag] || map.green
  return (
    <span className={`pill ${f.cls}`}>
      <span className="pill-dot"></span>
      {f.text}
    </span>
  )
}

export function StatusPill({ status }) {
  const styles = {
    Active: 'pill-green',
    Overdue: 'pill-red',
    Closed: 'pill-navy',
    Pending: 'pill-yellow',
    Approved: 'pill-green',
    Rejected: 'pill-red',
    Inactive: 'pill-navy',
  }
  return <span className={`pill ${styles[status] || 'pill-navy'}`}>{status}</span>
}

export function Modal({ title, show, onClose, children, footer, size = '' }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (show) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [show, onClose])

  if (!show) return null
  return (
    <>
      <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(11,21,38,0.5)' }}>
        <div className={`modal-dialog modal-dialog-centered ${size}`}>
          <div className="modal-content" style={{ borderRadius: 12, border: 'none' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--hairline)' }}>
              <h5 className="modal-title font-display" style={{ fontSize: '1.05rem' }}>
                {title}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && (
              <div className="modal-footer" style={{ borderTop: '1px solid var(--hairline)' }}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export function EmptyState({ icon = 'bi-inbox', text = 'Nothing here yet.' }) {
  return (
    <div className="empty-state">
      <i className={`bi ${icon}`} style={{ fontSize: '2rem', opacity: 0.4 }}></i>
      <p className="mb-0 mt-2">{text}</p>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">
      <div>
        {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
        <h4 className="mb-0">{title}</h4>
        {subtitle && <div className="text-secondary small mt-1">{subtitle}</div>}
      </div>
      {action}
    </div>
  )
}

export function formatINR(n) {
  const num = Number(n || 0)
  return '₹' + num.toLocaleString('en-IN')
}

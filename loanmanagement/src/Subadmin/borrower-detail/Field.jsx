import React from 'react'

// Shows one label + value pair. Used inside the borrower detail tabs.
export default function Field({ label, value, full, mono }) {
  return (
    <div className={full ? 'col-12' : 'col-md-6'}>
      <div className="stat-card-label">{label}</div>
      <div className={mono ? 'ledger-amount' : 'fw-semibold'} style={{ fontSize: '0.92rem' }}>
        {value || '—'}
      </div>
    </div>
  )
}

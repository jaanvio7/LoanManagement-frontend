import React from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading, FlagPill, formatINR } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'

const FLAG_INFO = [
  { key: 'green', title: 'Green', desc: '1 – 2 Days overdue', accent: 'emerald' },
  { key: 'yellow', title: 'Yellow', desc: '3 Days – Under 1 Week', accent: 'gold' },
  { key: 'red', title: 'Red', desc: 'Over 1 Week — Defaulter Report', accent: 'rose' },
]

export default function DefaulterReport() {
  const { store } = useData()
  const { borrowers } = store
  const defaulters = borrowers.filter((b) => b.flag === 'red')

  return (
    <>
      <SectionHeading eyebrow="Reports" title="Defaulter Report" subtitle="Payment delay is tracked automatically by colour flag and escalates over time." />

      <div className="row g-3 mb-4">
        {FLAG_INFO.map((f) => {
          const count = borrowers.filter((b) => b.flag === f.key).length
          const accentColors = { emerald: 'var(--emerald)', gold: 'var(--gold)', rose: 'var(--rose)' }
          const softColors = { emerald: 'var(--emerald-soft)', gold: 'var(--gold-soft)', rose: 'var(--rose-soft)' }
          return (
            <div className="col-md-4" key={f.key}>
              <div className="stat-card" style={{ '--accent': accentColors[f.accent], '--accent-soft': softColors[f.accent] }}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="stat-card-label">{f.title} Flag</div>
                    <div className="stat-card-value">{count}</div>
                    <div className="text-secondary small mt-1">{f.desc}</div>
                  </div>
                  <div className="stat-card-icon"><i className="bi bi-flag-fill"></i></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="ledger-table-wrap mb-4">
        <div className="table-header-row">
          <span className="fw-semibold">All Borrowers by Flag Status</span>
        </div>
        <table className="ledger">
          <thead>
            <tr>
              <th>#</th>
              <th>Borrower</th>
              <th>Firm</th>
              <th>Outstanding</th>
              <th>Flag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {borrowers.map((b, i) => (
              <tr key={b.id}>
                <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                <td className="fw-semibold">{b.name}</td>
                <td className="small">{b.firm}</td>
                <td className="ledger-amount">{formatINR(b.principal)}</td>
                <td><FlagPill flag={b.flag} /></td>
                <td>
                  <Link to={`/subadmin/borrowers/${b.id}`} className="btn-soft-icon">
                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <span className="fw-semibold text-danger">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> Defaulter Report
          </span>
          <span className="text-secondary small">Auto-moved from Red flag, overdue &gt; 1 week</span>
        </div>
        {defaulters.length === 0 ? (
          <p className="text-secondary small p-4 mb-0">No borrowers currently in default.</p>
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Borrower</th>
                <th>Security Held</th>
                <th>Outstanding</th>
                <th>Guarantor</th>
              </tr>
            </thead>
            <tbody>
              {defaulters.map((b, i) => (
                <tr key={b.id}>
                  <td className="ledger-serial">{i + 1}</td>
                  <td>
                    <div className="fw-semibold">{b.name}</div>
                    <div className="ledger-id">{b.id} · {b.phone}</div>
                  </td>
                  <td className="small">
                    {[b.security?.vehicle, b.security?.property, b.security?.jewellery].filter(Boolean).join(', ') || 'None on file'}
                  </td>
                  <td className="ledger-amount text-danger">{formatINR(b.principal)}</td>
                  <td className="small">{b.guarantor?.name} ({b.guarantor?.relation})</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

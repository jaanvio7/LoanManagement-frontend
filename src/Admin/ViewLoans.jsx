import React, { useState } from 'react'
import { SectionHeading, FlagPill, StatusPill, formatINR } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'

export default function ViewLoans() {
  const { store } = useData()
  const [typeFilter, setTypeFilter] = useState('All')

  const loans = store.borrowers.filter((b) => typeFilter === 'All' || b.loanType === typeFilter)

  return (
    <>
      <SectionHeading eyebrow="Overview" title="View Loans" subtitle="Read-only view of every loan created by subadmins across firms." />

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <button className={`btn btn-sm ${typeFilter === 'All' ? 'btn-navy' : 'btn-light border'}`} onClick={() => setTypeFilter('All')}>
          All
        </button>
        {store.loanTypes.map((t) => (
          <button
            key={t.id}
            className={`btn btn-sm ${typeFilter === t.name ? 'btn-navy' : 'btn-light border'}`}
            onClick={() => setTypeFilter(t.name)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <span className="fw-semibold">{loans.length} Loans</span>
        </div>
        <table className="ledger">
          <thead>
            <tr>
              <th>#</th>
              <th>Borrower</th>
              <th>Firm</th>
              <th>Frequency</th>
              <th>Type</th>
              <th>Principal</th>
              <th>Flag</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((b, i) => (
              <tr key={b.id}>
                <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                <td>
                  <div className="fw-semibold">{b.name}</div>
                  <div className="ledger-id">{b.id}</div>
                </td>
                <td className="small">{b.firm}</td>
                <td><span className="pill pill-navy">{b.payFrequency}</span></td>
                <td className="small">{b.loanType}</td>
                <td className="ledger-amount">{formatINR(b.principal)}</td>
                <td><FlagPill flag={b.flag} /></td>
                <td><StatusPill status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

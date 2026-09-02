import React from 'react'
import { Link } from 'react-router-dom'
import { FlagPill, StatusPill, EmptyState, formatINR } from '../../Components/UI.jsx'

// Purely presentational: given a list of borrowers, render the table.
// No filtering, no state, no data-fetching happens here.
export default function BorrowerTable({ borrowers }) {
  if (borrowers.length === 0) {
    return <EmptyState text="No borrower profiles match your search." />
  }

  return (
    <table className="ledger">
      <thead>
        <tr>
          <th>#</th>
          <th>Borrower</th>
          <th>Firm</th>
          <th>Loan</th>
          <th>Outstanding</th>
          <th>Cibil</th>
          <th>Flag</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {borrowers.map((b, i) => (
          <tr key={b.id}>
            <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
            <td>
              <div className="fw-semibold">{b.name}</div>
              <div className="ledger-id">{b.id} · {b.phone}</div>
            </td>
            <td className="small">{b.firm}</td>
            <td className="small">
              {b.loanType}
              <div className="text-secondary">{b.payFrequency}</div>
            </td>
            <td className="ledger-amount">{formatINR(b.principal)}</td>
            <td className="small">{b.cibilPoints}</td>
            <td><FlagPill flag={b.flag} /></td>
            <td><StatusPill status={b.status} /></td>
            <td>
              <Link to={`/subadmin/borrowers/${b.id}`} className="btn btn-sm btn-outline-navy">
                Open <i className="bi bi-arrow-right"></i>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

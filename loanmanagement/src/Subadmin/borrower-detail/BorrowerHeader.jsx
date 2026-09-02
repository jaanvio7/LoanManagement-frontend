import React from 'react'
import { FlagPill, StatusPill, formatINR } from '../../Components/UI.jsx'

export default function BorrowerHeader({ borrower, balance }) {
  const initials = borrower.name.split(' ').map((p) => p[0]).slice(0, 2).join('')

  return (
    <div className="card-surface p-3 p-md-4 mb-3 d-flex flex-column flex-md-row justify-content-between gap-3">
      <div className="d-flex align-items-center gap-3">
        <div className="avatar-circle" style={{ width: 52, height: 52, fontSize: '1.1rem' }}>
          {initials}
        </div>
        <div>
          <h4 className="mb-0">{borrower.name}</h4>
          <div className="text-secondary small">{borrower.id} · {borrower.phone} · {borrower.firm}</div>
          <div className="d-flex gap-2 mt-2">
            <FlagPill flag={borrower.flag} />
            <StatusPill status={borrower.status} />
            {!borrower.locationVerified && <span className="pill pill-yellow">Pending Verification</span>}
          </div>
        </div>
      </div>
      <div className="text-md-end">
        <div className="stat-card-label">Outstanding Balance</div>
        <div className="stat-card-value">{formatINR(balance)}</div>
      </div>
    </div>
  )
}

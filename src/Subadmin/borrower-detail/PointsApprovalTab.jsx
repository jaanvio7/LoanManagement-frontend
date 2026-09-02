import React from 'react'
import { useData } from '../../Store/data.js'

// Talks to the data context directly instead of being handed an update
// function from its parent - it only needs the borrower's id.
export default function PointsApprovalTab({ borrower }) {
  const { updateBorrower } = useData()

  return (
    <div className="d-flex flex-column gap-3">
      <div className="card-surface p-4">
        <div className="section-eyebrow">Points Manage — Like Cibil Score</div>
        <div className="d-flex align-items-center gap-3">
          <div className="stat-card-value">{borrower.cibilPoints}</div>
          <div className="progress flex-grow-1" style={{ height: 8, borderRadius: 6 }}>
            <div className="progress-bar" style={{ width: `${(borrower.cibilPoints / 900) * 100}%`, background: 'var(--navy-800)' }}></div>
          </div>
        </div>
      </div>

      <div className="card-surface p-4">
        <div className="section-eyebrow">Left-Out Amount (Maff Amount)</div>
        <div className="d-flex align-items-center gap-3">
          <input
            type="number"
            className="form-control"
            style={{ maxWidth: 220 }}
            value={borrower.leftoverAmount}
            onChange={(e) => updateBorrower(borrower.id, { leftoverAmount: Number(e.target.value) })}
          />
          <span className="text-secondary small">Waived amount saved to the profile for the next case-close request.</span>
        </div>
      </div>

      <div className="card-surface p-4">
        <div className="section-eyebrow">Approval Rule</div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="approveBeforeVerify"
            checked={!borrower.locationVerified}
            onChange={(e) => updateBorrower(borrower.id, { locationVerified: !e.target.checked })}
          />
          <label className="form-check-label small" htmlFor="approveBeforeVerify">
            Loan approved before location verification (no switching between Daily / Weekly / Monthly once set)
          </label>
        </div>
      </div>
    </div>
  )
}

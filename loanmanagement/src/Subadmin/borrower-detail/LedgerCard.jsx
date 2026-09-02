import React from 'react'
import { formatINR } from '../../Components/UI.jsx'
import calcLedger from './calcLedger.js'

// Does its own math from the collections it is given - no other component
// needs to calculate totals for it.
export default function LedgerCard({ borrower, collections }) {
  const { paid, totalDue, balance } = calcLedger(borrower, collections)

  return (
    <div className="card-surface p-4">
      <div className="section-eyebrow">Calculation Engine — Installment Ledger</div>
      <div className="row g-3 mb-3">
        <div className="col-4">
          <div className="stat-card-label">Total Payable</div>
          <div className="fw-semibold ledger-amount">{formatINR(totalDue)}</div>
        </div>
        <div className="col-4">
          <div className="stat-card-label">Paid to Date</div>
          <div className="fw-semibold ledger-amount" style={{ color: 'var(--emerald)' }}>{formatINR(paid)}</div>
        </div>
        <div className="col-4">
          <div className="stat-card-label">Balance</div>
          <div className="fw-semibold ledger-amount" style={{ color: 'var(--rose)' }}>{formatINR(balance)}</div>
        </div>
      </div>
      <div className="progress mb-3" style={{ height: 8, borderRadius: 6 }}>
        <div
          className="progress-bar"
          style={{ width: `${Math.min((paid / totalDue) * 100, 100)}%`, background: 'var(--gold)' }}
        ></div>
      </div>
      {collections.length === 0 ? (
        <p className="text-secondary small mb-0">No installments recorded in the ledger yet.</p>
      ) : (
        <table className="ledger">
          <thead>
            <tr>
              <th>#</th>
              <th>Receipt</th>
              <th>Date</th>
              <th>Mode</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c, i) => (
              <tr key={c.id}>
                <td className="ledger-serial">{i + 1}</td>
                <td className="ledger-id">{c.id}</td>
                <td className="small">{c.date}</td>
                <td className="small">{c.mode}</td>
                <td className="ledger-amount">{formatINR(c.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

import React from 'react'
import { SectionHeading, StatusPill, EmptyState, formatINR } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'
import { useAuth } from '../Store/auth.js'

export default function DepositRequests() {
  const { store, updateDepositRequest } = useData()
  const { user } = useAuth()
  const requests = store.depositRequests

  function decide(req, status) {
    updateDepositRequest(req.id, { status, approvedBy: status === 'Approved' ? user?.name : '' })
  }

  return (
    <>
      <SectionHeading
        eyebrow="Operations"
        title="Deposit Requests"
        subtitle="Cash deposits sent in by field workers, waiting to be approved."
      />

      <div className="ledger-table-wrap">
        {requests.length === 0 ? (
          <EmptyState icon="bi-safe" text="No deposit requests yet." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Request</th>
                <th>Worker</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((d, i) => (
                <tr key={d.id}>
                  <td className="ledger-serial">{i + 1}</td>
                  <td>
                    <div className="ledger-id">{d.id}</div>
                    <div className="text-secondary small">{d.date}</div>
                  </td>
                  <td className="fw-semibold small">{d.worker}</td>
                  <td className="ledger-amount">{formatINR(d.amount)}</td>
                  <td className="small">{d.paymentMode}</td>
                  <td>
                    <StatusPill status={d.status} />
                    {d.approvedBy && <div className="text-secondary small mt-1">by {d.approvedBy}</div>}
                  </td>
                  <td>
                    {d.status === 'Pending' ? (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-navy" onClick={() => decide(d, 'Approved')}>Approve</button>
                        <button className="btn btn-sm btn-outline-navy" onClick={() => decide(d, 'Rejected')}>Reject</button>
                      </div>
                    ) : (
                      <span className="text-secondary small">Decided</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

import React from 'react'
import { SectionHeading, StatusPill, EmptyState, formatINR } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'

export default function CaseCloseRequests() {
  const { store, updateCaseCloseRequest, updateBorrower } = useData()
  const requests = store.caseCloseRequests

  function decide(req, status) {
    updateCaseCloseRequest(req.id, { status })
    if (status === 'Approved') {
      updateBorrower(req.borrowerId, { status: 'Closed' })
    }
  }

  return (
    <>
      <SectionHeading
        eyebrow="Operations"
        title="Manage Case Close Requests"
        subtitle="Requests raised by field workers, including any left-out (maff) amount saved on the borrower profile."
      />

      <div className="ledger-table-wrap">
        {requests.length === 0 ? (
          <EmptyState text="No case close requests yet." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Request</th>
                <th>Borrower</th>
                <th>Requested By</th>
                <th>Leftover Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r.id}>
                  <td className="ledger-serial">{i + 1}</td>
                  <td className="ledger-id">{r.id}</td>
                  <td>
                    <div className="fw-semibold">{r.borrowerName}</div>
                    <div className="ledger-id">{r.borrowerId}</div>
                  </td>
                  <td className="small">
                    {r.requestedBy}
                    <div className="text-secondary">{r.requestedOn}</div>
                  </td>
                  <td className="ledger-amount">{r.leftoverAmount ? formatINR(r.leftoverAmount) : '—'}</td>
                  <td><StatusPill status={r.status} /></td>
                  <td>
                    {r.status === 'Pending' ? (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-navy" onClick={() => decide(r, 'Approved')}>Approve</button>
                        <button className="btn btn-sm btn-outline-navy" onClick={() => decide(r, 'Rejected')}>Reject</button>
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

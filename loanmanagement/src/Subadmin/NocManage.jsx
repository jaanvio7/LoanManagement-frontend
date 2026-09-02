import React, { useState } from 'react'
import { SectionHeading, StatusPill, EmptyState } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'

export default function NocManage() {
  const { store, addNocRecord, removeNocRecord } = useData()
  const [firm, setFirm] = useState(store.firms[0])
  const [selected, setSelected] = useState('')

  const eligibleForNoc = store.borrowers.filter((b) => b.status === 'Closed' || b.leftoverAmount === 0)

  function handleIssue(e) {
    e.preventDefault()
    if (!selected) return
    const b = store.borrowers.find((x) => x.id === selected)
    addNocRecord({
      borrowerId: b.id,
      borrowerName: b.name,
      firm,
      date: new Date().toISOString().slice(0, 10),
      status: 'Issued',
    })
    setSelected('')
  }

  return (
    <>
      <SectionHeading eyebrow="Operations" title="NOC — Add & Manage" subtitle="Issue a No Objection Certificate once a loan is fully settled, under the chosen firm." />

      <div className="row g-3">
        <div className="col-lg-5">
          <div className="card-surface p-4">
            <div className="section-eyebrow">Firm Selection</div>
            <div className="d-flex gap-2 mb-3">
              {store.firms.map((f) => (
                <button key={f} className={`btn btn-sm ${firm === f ? 'btn-navy' : 'btn-light border'}`} onClick={() => setFirm(f)}>
                  {f}
                </button>
              ))}
            </div>

            <form onSubmit={handleIssue}>
              <label className="form-label small fw-semibold">Borrower</label>
              <select className="form-select mb-3" value={selected} onChange={(e) => setSelected(e.target.value)} required>
                <option value="">Select a settled borrower...</option>
                {eligibleForNoc.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} — {b.id}</option>
                ))}
              </select>
              <button className="btn btn-gold w-100" type="submit">
                <i className="bi bi-file-earmark-check me-2"></i>Generate NOC
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="ledger-table-wrap">
            <div className="table-header-row">
              <span className="fw-semibold">Issued NOCs</span>
              <span className="text-secondary small">{store.nocRecords.length} total</span>
            </div>
            {store.nocRecords.length === 0 ? (
              <EmptyState icon="bi-file-earmark-check" text="No NOCs issued yet." />
            ) : (
              <table className="ledger">
                <thead>
                  <tr>
                    <th>NOC No.</th>
                    <th>Borrower</th>
                    <th>Firm</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {store.nocRecords.map((n) => (
                    <tr key={n.id}>
                      <td className="ledger-id">{n.id}</td>
                      <td className="fw-semibold">{n.borrowerName}</td>
                      <td className="small">{n.firm}</td>
                      <td className="small">{n.date}</td>
                      <td><StatusPill status={n.status} /></td>
                      <td>
                        <button className="btn-soft-icon" onClick={() => removeNocRecord(n.id)}>
                          <i className="bi bi-trash text-danger"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

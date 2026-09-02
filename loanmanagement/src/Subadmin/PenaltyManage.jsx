import React from 'react'
import { SectionHeading } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'
import AddPenaltySlabModal from './penalty-manage/AddPenaltySlabModal.jsx'

export default function PenaltyManage() {
  const { store, removePenaltySlab } = useData()

  return (
    <>
      <SectionHeading
        eyebrow="Lending"
        title="Penalty Management"
        subtitle="Late-payment penalty slabs, based on principal amount and days overdue."
        action={<AddPenaltySlabModal />}
      />

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <span className="fw-semibold">Penalty Slabs</span>
          <span className="text-secondary small">{store.penaltySlabs.length} slabs configured</span>
        </div>
        <table className="ledger">
          <thead>
            <tr>
              <th>#</th>
              <th>Principal Band</th>
              <th>Overdue Window</th>
              <th>Penalty / Day</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {store.penaltySlabs.map((p, i) => (
              <tr key={p.id}>
                <td className="ledger-serial">{i + 1}</td>
                <td className="fw-semibold">{p.principalBand}</td>
                <td><span className="pill pill-navy">{p.dayRange}</span></td>
                <td className="ledger-amount">₹{p.perDay} / Day</td>
                <td>
                  <button className="btn-soft-icon" onClick={() => removePenaltySlab(p.id)}>
                    <i className="bi bi-trash text-danger"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="alert mt-3 d-flex gap-2" style={{ background: '#fff', border: '1px solid var(--hairline)', borderRadius: 10 }}>
        <i className="bi bi-calculator mt-1" style={{ color: 'var(--gold)' }}></i>
        <div className="small text-secondary">
          Example: on a ₹10,000 principal, a payment that is 45 days overdue is charged at the 31–60 day slab
          rate — ₹200 per day — applied from the day it fell due.
        </div>
      </div>
    </>
  )
}

import React, { useState } from 'react'
import { Modal } from '../../Components/UI.jsx'
import { useData } from '../../Store/data.js'

const emptyForm = {
  name: '',
  phone: '',
  address: '',
  firm: 'Gaba Finance',
  loanType: 'Interest Based',
  payFrequency: 'Daily',
  principal: '',
  interestRate: '',
  installmentAmount: '',
  guarantor: { name: '', phone: '', relation: '', address: '' },
  cibilPoints: 700,
  leftoverAmount: 0,
  flag: 'green',
  status: 'Active',
  locationVerified: false,
  security: { vehicle: '', property: '', jewellery: '' },
  payment: { mode: 'Cash', ref: '' },
  filePosition: { rack: '', level: '', color: 'Green' },
}

// This component owns everything about "adding a borrower": the button that
// opens it, the form state, and saving to the data context. The page that
// uses it just drops in <AddBorrowerModal /> - no data passed in or out.
export default function AddBorrowerModal() {
  const { store, addBorrower } = useData()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleSave(e) {
    e.preventDefault()
    addBorrower({
      ...form,
      principal: Number(form.principal) || 0,
      interestRate: Number(form.interestRate) || 0,
      installmentAmount: Number(form.installmentAmount) || 0,
      disbursedOn: new Date().toISOString().slice(0, 10),
      tenureDays: 100,
    })
    setForm(emptyForm)
    setShow(false)
  }

  return (
    <>
      <button className="btn btn-gold btn-sm" onClick={() => setShow(true)}>
        <i className="bi bi-plus-lg me-1"></i> Add Borrower
      </button>

      <Modal
        title="Add Borrower Profile"
        show={show}
        onClose={() => setShow(false)}
        size="modal-lg"
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShow(false)}>Cancel</button>
            <button className="btn btn-gold" form="borrower-form" type="submit">Create Profile</button>
          </>
        }
      >
        <form id="borrower-form" onSubmit={handleSave}>
          <div className="section-eyebrow">General Details</div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Full Name</label>
              <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Phone</label>
              <input className="form-control" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">Address</label>
              <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>

          <div className="section-eyebrow mt-2">Guarantor Person Details</div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Guarantor Name</label>
              <input className="form-control" value={form.guarantor.name} onChange={(e) => setForm({ ...form, guarantor: { ...form.guarantor, name: e.target.value } })} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Relation</label>
              <input className="form-control" value={form.guarantor.relation} onChange={(e) => setForm({ ...form, guarantor: { ...form.guarantor, relation: e.target.value } })} />
            </div>
          </div>

          <div className="section-eyebrow mt-2">Loan Details</div>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Firm</label>
              <select className="form-select" value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })}>
                {store.firms.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Pay Frequency</label>
              <select className="form-select" value={form.payFrequency} onChange={(e) => setForm({ ...form, payFrequency: e.target.value })}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Loan Type</label>
              <select className="form-select" value={form.loanType} onChange={(e) => setForm({ ...form, loanType: e.target.value })}>
                {store.loanTypes.map((t) => (
                  <option key={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Principal (₹)</label>
              <input type="number" className="form-control" required value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Interest Rate (%)</label>
              <input type="number" className="form-control" value={form.interestRate} onChange={(e) => setForm({ ...form, interestRate: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Installment Amount (₹)</label>
              <input type="number" className="form-control" required value={form.installmentAmount} onChange={(e) => setForm({ ...form, installmentAmount: e.target.value })} />
            </div>
          </div>

          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="locVerified"
              checked={form.locationVerified}
              onChange={(e) => setForm({ ...form, locationVerified: e.target.checked })}
            />
            <label className="form-check-label small" htmlFor="locVerified">
              Location already verified (otherwise loan is approved pending verification)
            </label>
          </div>
        </form>
      </Modal>
    </>
  )
}

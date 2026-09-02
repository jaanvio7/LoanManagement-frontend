import React, { useState } from 'react'
import { Modal } from '../../Components/UI.jsx'
import { useData } from '../../Store/data.js'

const emptyForm = { name: '', description: '', icon: 'bi-tag' }

export default function AddLoanTypeModal() {
  const { addLoanType } = useData()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleSave(e) {
    e.preventDefault()
    addLoanType(form)
    setForm(emptyForm)
    setShow(false)
  }

  return (
    <>
      <button className="btn btn-gold btn-sm" onClick={() => setShow(true)}>
        <i className="bi bi-plus-lg me-1"></i> Add Loan Type
      </button>

      <Modal
        title="Add Loan Type"
        show={show}
        onClose={() => setShow(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShow(false)}>Cancel</button>
            <button className="btn btn-gold" form="loan-type-form" type="submit">Save Loan Type</button>
          </>
        }
      >
        <form id="loan-type-form" onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Loan Type Name</label>
            <input className="form-control" required placeholder="e.g. Gold Backed" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label small fw-semibold">Description</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </form>
      </Modal>
    </>
  )
}

import React, { useState } from 'react'
import { Modal } from '../../Components/UI.jsx'
import { useData } from '../../Store/data.js'

const emptyForm = { principalBand: '', dayRange: '', perDay: '' }

// Owns the button, the form state, and the save action. The page just
// drops in <AddPenaltySlabModal /> with nothing passed in or out.
export default function AddPenaltySlabModal() {
  const { addPenaltySlab } = useData()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleSave(e) {
    e.preventDefault()
    addPenaltySlab({ ...form, perDay: Number(form.perDay) })
    setForm(emptyForm)
    setShow(false)
  }

  return (
    <>
      <button className="btn btn-gold btn-sm" onClick={() => setShow(true)}>
        <i className="bi bi-plus-lg me-1"></i> Add Slab
      </button>

      <Modal
        title="Add Penalty Slab"
        show={show}
        onClose={() => setShow(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShow(false)}>Cancel</button>
            <button className="btn btn-gold" form="penalty-form" type="submit">Save Slab</button>
          </>
        }
      >
        <form id="penalty-form" onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Principal Band</label>
            <input className="form-control" placeholder="e.g. ₹20,000" required value={form.principalBand} onChange={(e) => setForm({ ...form, principalBand: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Overdue Window</label>
            <input className="form-control" placeholder="e.g. 1 – 30 Days" required value={form.dayRange} onChange={(e) => setForm({ ...form, dayRange: e.target.value })} />
          </div>
          <div>
            <label className="form-label small fw-semibold">Penalty per Day (₹)</label>
            <input type="number" className="form-control" required value={form.perDay} onChange={(e) => setForm({ ...form, perDay: e.target.value })} />
          </div>
        </form>
      </Modal>
    </>
  )
}

import React, { useEffect, useState } from 'react'
import { SectionHeading, EmptyState, Modal } from '../Components/UI.jsx'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'

const FREQUENCY_OPTIONS = ['daily', 'weekly', 'monthly']
const INTEREST_TYPE_OPTIONS = ['flat', 'reducing']

export default function LoanTypeManagement() {
  const [loanTypes, setLoanTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [name, setName] = useState('')
  const [frequencyType, setFrequencyType] = useState('daily')
  const [interestApplicable, setInterestApplicable] = useState(true)
  const [interestType, setInterestType] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [description, setDescription] = useState('')

  const [confirmDeleteLoanType, setConfirmDeleteLoanType] = useState(null)

  useEffect(() => {
    fetchLoanTypes()
  }, [])

  function fetchLoanTypes() {
    const token = sessionStorage.getItem('token')
    setLoading(true)
    const subAdminId = sessionStorage.getItem('subAdminId')
    apiServices
      .getallLoanTypes({ addedById: subAdminId }, { headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          setLoanTypes(res?.data || [])
        } else {
          toast.error(res?.message || 'Failed to load loan types.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while loading loan types.')
      })
      .finally(() => setLoading(false))
  }

  const filtered = loanTypes.filter((l) =>
    (l.name || '').toLowerCase().includes(query.toLowerCase())
  )

  function resetForm() {
    setName('')
    setFrequencyType('daily')
    setInterestApplicable(true)
    setInterestType('')
    setInterestRate('')
    setDescription('')
  }

  useEffect(() => {
    if (!showModal) resetForm()
  }, [showModal])

  function openAdd() {
    setEditingId(null)
    resetForm()
    setShowModal(true)
  }

  function openEdit(loanType) {
    setEditingId(loanType._id)
    setName(loanType.name || '')
    setFrequencyType(loanType.frequencyType || 'daily')
    setInterestApplicable(loanType.interestApplicable !== false)
    setInterestType(loanType.interestType || '')
    setInterestRate(loanType.interestRate ?? '')
    setDescription(loanType.description || '')
    setShowModal(true)
  }

  function handleSave(e) {
    e.preventDefault()

    const token = sessionStorage.getItem('token')
    const currentUserId = sessionStorage.getItem('adminId') || sessionStorage.getItem('subAdminId')

    const payload = {
      name,
      frequencyType,
      interestApplicable,
      interestType: interestApplicable ? interestType || null : null,
      interestRate: interestApplicable ? Number(interestRate) || 0 : 0,
      description,
    }

    if (editingId) {
      payload._id = editingId
      payload.updatedById = currentUserId

      apiServices
        .updateLoanType(payload, { headers: { authorization: token } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Loan type updated successfully.')
            setShowModal(false)
            fetchLoanTypes()
          } else {
            toast.error(res?.message || 'Failed to update loan type.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    } else {
      payload.addedById = currentUserId

      apiServices
        .addLoanType(payload, { headers: { authorization: token } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Loan type added successfully.')
            setShowModal(false)
            fetchLoanTypes()
          } else {
            toast.error(res?.message || 'Failed to add loan type.')
          }
        })
        .catch((error) => {
          console.error('Add Loan Type Error:', error?.response?.data)
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    }
  }

  function toggleStatus(l) {
    const token = sessionStorage.getItem('token')
    apiServices
      .updateLoanType(
        { _id: l._id, status: l.status === 'Active' ? 'Inactive' : 'Active' },
        { headers: { authorization: token } }
      )
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success('Loan type status updated.')
          fetchLoanTypes()
        } else {
          toast.error(res?.message || 'Failed to update status.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
  }

  function handleDelete(id) {
    // Backend uses a soft delete (isDelete flag) rather than a hard delete.
    apiServices
      .deleteLoanType({ _id: id }, { headers: { authorization: sessionStorage.getItem('token') } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(res.message || 'Loan type removed successfully.')
          fetchLoanTypes()
        } else {
          toast.error(res?.message || 'Failed to remove loan type.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
      .finally(() => setConfirmDeleteLoanType(null))
  }

  return (
    <>
      <SectionHeading
        eyebrow="Lending Setup"
        title="Loan Type Management"
        subtitle="Define daily, weekly and monthly loan types along with their interest rules."
        action={
          <button className="btn btn-gold btn-sm" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i> Add Loan Type
          </button>
        }
      />

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <input
            className="form-control form-control-sm"
            style={{ maxWidth: 260 }}
            placeholder="Search by loan type name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-secondary small">{filtered.length} loan types</span>
        </div>

        {loading ? (
          <div className="p-4 text-secondary small">Loading loan types...</div>
        ) : filtered.length === 0 ? (
          <EmptyState text="No loan types match your search." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Frequency</th>
                <th>Interest</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l._id}>
                  <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="fw-semibold">{l.name}</div>
                    {l.description && <div className="text-secondary small">{l.description}</div>}
                  </td>
                  <td className="small text-capitalize">{l.frequencyType}</td>
                  <td className="small">
                    {l.interestApplicable ? (
                      <>
                        <div className="text-capitalize">{l.interestType || '—'}</div>
                        <div className="text-secondary">{l.interestRate}%</div>
                      </>
                    ) : (
                      <span className="text-secondary">No interest</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`pill ${l.status === 'Active' ? 'pill-green' : 'pill-navy'}`}
                      style={{ border: 'none' }}
                      onClick={() => toggleStatus(l)}
                    >
                      {l.status}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-soft-icon" onClick={() => openEdit(l)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-soft-icon" onClick={() => setConfirmDeleteLoanType(l)}>
                        <i className="bi bi-trash text-danger"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        title={editingId ? 'Edit Loan Type' : 'Add Loan Type'}
        show={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-gold" form="loan-type-form" type="submit">Save Loan Type</button>
          </>
        }
      >
        <form id="loan-type-form" onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Loan Type Name</label>
            <input className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Frequency Type</label>
            <select
              className="form-control"
              required
              value={frequencyType}
              onChange={(e) => setFrequencyType(e.target.value)}
            >
              {FREQUENCY_OPTIONS.map((f) => (
                <option key={f} value={f} className="text-capitalize">{f}</option>
              ))}
            </select>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="interestApplicable"
              checked={interestApplicable}
              onChange={(e) => setInterestApplicable(e.target.checked)}
            />
            <label className="form-check-label small fw-semibold" htmlFor="interestApplicable">
              Interest Applicable
            </label>
          </div>

          {interestApplicable && (
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Interest Type</label>
                <select
                  className="form-control"
                  value={interestType}
                  onChange={(e) => setInterestType(e.target.value)}
                >
                  <option value="">Select type</option>
                  {INTEREST_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t} className="text-capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">Interest Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      <Modal
        title="Remove Loan Type"
        show={!!confirmDeleteLoanType}
        onClose={() => setConfirmDeleteLoanType(null)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setConfirmDeleteLoanType(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteLoanType._id)}>
              Remove
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to remove <strong>{confirmDeleteLoanType?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
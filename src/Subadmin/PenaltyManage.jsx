import React, { useEffect, useState } from 'react'
import { SectionHeading, EmptyState, Modal } from '../Components/UI.jsx'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'

const PENALTY_TYPE_OPTIONS = ['fixed', 'percentage']
const CALCULATION_BASIS_OPTIONS = ['Principal Amount', 'Outstanding Amount', 'Installment Amount']

export default function PenaltyManage() {
  const [penaltyRules, setPenaltyRules] = useState([])
  const [loanTypes, setLoanTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [loanTypeId, setLoanTypeId] = useState('')
  const [minDays, setMinDays] = useState('')
  const [maxDays, setMaxDays] = useState('')
  const [penaltyType, setPenaltyType] = useState('fixed')
  const [penaltyAmount, setPenaltyAmount] = useState('')
  const [percentage, setPercentage] = useState('')
  const [calculationBasis, setCalculationBasis] = useState('')

  const [confirmDeleteRule, setConfirmDeleteRule] = useState(null)

  useEffect(() => {
    fetchPenaltyRules()
    fetchLoanTypes()
  }, [])

  function fetchPenaltyRules() {
    const token = sessionStorage.getItem('token')
    setLoading(true)
    apiServices
      .getallPenaltyRules({ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          setPenaltyRules(res?.data || [])
        } else {
          toast.error(res?.message || 'Failed to load penalty rules.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while loading penalty rules.')
      })
      .finally(() => setLoading(false))
  }

  function fetchLoanTypes() {
    const token = sessionStorage.getItem('token')
    apiServices
      .getallLoanTypes({ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) setLoanTypes(res?.data || [])
      })
      .catch(() => {
        // dropdown is non-critical; fail silently
      })
  }

  function resetForm() {
    setLoanTypeId('')
    setMinDays('')
    setMaxDays('')
    setPenaltyType('fixed')
    setPenaltyAmount('')
    setPercentage('')
    setCalculationBasis('')
  }

  useEffect(() => {
    if (!showModal) resetForm()
  }, [showModal])

  function openAdd() {
    setEditingId(null)
    resetForm()
    setShowModal(true)
  }

  function openEdit(rule) {
    setEditingId(rule._id)
    setLoanTypeId(rule.loanTypeId?._id || rule.loanTypeId || '')
    setMinDays(rule.minDays ?? '')
    setMaxDays(rule.maxDays ?? '')
    setPenaltyType(rule.penaltyType || 'fixed')
    setPenaltyAmount(rule.penaltyAmount ?? '')
    setPercentage(rule.percentage ?? '')
    setCalculationBasis(rule.calculationBasis || '')
    setShowModal(true)
  }

  function handleSave(e) {
    e.preventDefault()

    const token = sessionStorage.getItem('token')
    const currentUserId = sessionStorage.getItem('adminId') || sessionStorage.getItem('subAdminId')

    const payload = {
      loanTypeId: loanTypeId || null,
      minDays: Number(minDays) || 0,
      maxDays: Number(maxDays) || 0,
      penaltyType,
      penaltyAmount: penaltyType === 'fixed' ? Number(penaltyAmount) || 0 : 0,
      percentage: penaltyType === 'percentage' ? Number(percentage) || 0 : 0,
      calculationBasis,
    }

    if (editingId) {
      payload._id = editingId
      payload.updatedById = currentUserId

      apiServices
        .updatePenaltyRule(payload, { headers: { authorization: token } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Penalty rule updated successfully.')
            setShowModal(false)
            fetchPenaltyRules()
          } else {
            toast.error(res?.message || 'Failed to update penalty rule.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    } else {
      payload.addedById = currentUserId

      apiServices
        .addPenaltyRule(payload, { headers: { authorization: token } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Penalty rule added successfully.')
            setShowModal(false)
            fetchPenaltyRules()
          } else {
            toast.error(res?.message || 'Failed to add penalty rule.')
          }
        })
        .catch((error) => {
          console.error('Add Penalty Rule Error:', error?.response?.data)
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    }
  }

  function toggleStatus(rule) {
    const token = sessionStorage.getItem('token')
    apiServices
      .updatePenaltyRule({ _id: rule._id, status: !rule.status }, { headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success('Penalty rule status updated.')
          fetchPenaltyRules()
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
      .deletePenaltyRule({ _id: id }, { headers: { authorization: sessionStorage.getItem('token') } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(res.message || 'Penalty rule removed successfully.')
          fetchPenaltyRules()
        } else {
          toast.error(res?.message || 'Failed to remove penalty rule.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
      .finally(() => setConfirmDeleteRule(null))
  }

  return (
    <>
      <SectionHeading
        eyebrow="Lending"
        title="Penalty Management"
        subtitle="Late-payment penalty rules, based on loan type and days overdue."
        action={
          <button className="btn btn-gold btn-sm" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i> Add Penalty Rule
          </button>
        }
      />

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <span className="fw-semibold">Penalty Rules</span>
          <span className="text-secondary small">{penaltyRules.length} rules configured</span>
        </div>

        {loading ? (
          <div className="p-4 text-secondary small">Loading penalty rules...</div>
        ) : penaltyRules.length === 0 ? (
          <EmptyState text="No penalty rules configured yet." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Loan Type</th>
                <th>Overdue Window</th>
                <th>Penalty</th>
                <th>Basis</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {penaltyRules.map((p, i) => (
                <tr key={p._id}>
                  <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                  <td className="fw-semibold">{p.loanTypeId?.name || 'All Loan Types'}</td>
                  <td>
                    <span className="pill pill-navy">{p.minDays} – {p.maxDays} days</span>
                  </td>
                  <td className="ledger-amount">
                    {p.penaltyType === 'percentage'
                      ? `${p.percentage}%`
                      : `₹${p.penaltyAmount}`}
                    <div className="text-secondary small text-capitalize">{p.penaltyType}</div>
                  </td>
                  <td className="small">{p.calculationBasis || '—'}</td>
                  <td>
                    <button
                      className={`pill ${p.status ? 'pill-green' : 'pill-navy'}`}
                      style={{ border: 'none' }}
                      onClick={() => toggleStatus(p)}
                    >
                      {p.status ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-soft-icon" onClick={() => openEdit(p)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-soft-icon" onClick={() => setConfirmDeleteRule(p)}>
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

      <div className="alert mt-3 d-flex gap-2" style={{ background: '#fff', border: '1px solid var(--hairline)', borderRadius: 10 }}>
        <i className="bi bi-calculator mt-1" style={{ color: 'var(--gold)' }}></i>
        <div className="small text-secondary">
          Example: for a loan overdue by 45 days, the rule whose 31–60 day window matches is applied — either a
          fixed amount per day or a percentage of the selected calculation basis.
        </div>
      </div>

      <Modal
        title={editingId ? 'Edit Penalty Rule' : 'Add Penalty Rule'}
        show={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-gold" form="penalty-form" type="submit">Save Rule</button>
          </>
        }
      >
        <form id="penalty-form" onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Loan Type</label>
            <select className="form-control" value={loanTypeId} onChange={(e) => setLoanTypeId(e.target.value)}>
              <option value="">All Loan Types</option>
              {loanTypes.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Min Days Overdue</label>
              <input type="number" min="0" className="form-control" required value={minDays} onChange={(e) => setMinDays(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Max Days Overdue</label>
              <input type="number" min="0" className="form-control" required value={maxDays} onChange={(e) => setMaxDays(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Penalty Type</label>
            <select className="form-control" value={penaltyType} onChange={(e) => setPenaltyType(e.target.value)}>
              {PENALTY_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t} className="text-capitalize">{t}</option>
              ))}
            </select>
          </div>

          {penaltyType === 'fixed' ? (
            <div className="mb-3">
              <label className="form-label small fw-semibold">Penalty Amount (per day)</label>
              <input type="number" min="0" className="form-control" value={penaltyAmount} onChange={(e) => setPenaltyAmount(e.target.value)} />
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label small fw-semibold">Percentage (per day)</label>
              <input type="number" min="0" step="0.01" className="form-control" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-semibold">Calculation Basis</label>
            <select className="form-control" value={calculationBasis} onChange={(e) => setCalculationBasis(e.target.value)}>
              <option value="">Select basis</option>
              {CALCULATION_BASIS_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        title="Remove Penalty Rule"
        show={!!confirmDeleteRule}
        onClose={() => setConfirmDeleteRule(null)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setConfirmDeleteRule(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteRule._id)}>
              Remove
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to remove this penalty rule? This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
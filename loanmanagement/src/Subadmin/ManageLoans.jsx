import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SectionHeading, EmptyState, Modal } from '../Components/UI.jsx'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'

const LOAN_STATUS_OPTIONS = ['Pending', 'Active', 'Completed', 'Closed', 'Defaulted', 'Cancelled']
const FLAG_OPTIONS = ['Green', 'Yellow', 'Red', 'Defaulter']

export default function ManageLoans() {
  const navigate = useNavigate()

  const [loans, setLoans] = useState([])
  const [loanTypes, setLoanTypes] = useState([])
  const [borrowers, setBorrowers] = useState([])
  const [loading, setLoading] = useState(false)

  const [query, setQuery] = useState('')
  const [loanTypeFilter, setLoanTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [borrowerId, setBorrowerId] = useState('')
  const [loanTypeId, setLoanTypeId] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [interestAmount, setInterestAmount] = useState('')
  const [principalAmount, setPrincipalAmount] = useState('')
  const [totalPayableAmount, setTotalPayableAmount] = useState('')
  const [installmentAmount, setInstallmentAmount] = useState('')
  const [totalInstallments, setTotalInstallments] = useState('')
  const [loanStartDate, setLoanStartDate] = useState('')
  const [firstInstallmentDate, setFirstInstallmentDate] = useState('')
  const [maturityDate, setMaturityDate] = useState('')
  const [security, setSecurity] = useState('')

  const [confirmDeleteLoan, setConfirmDeleteLoan] = useState(null)

  useEffect(() => {
    fetchLoans()
    fetchLoanTypes()
    fetchBorrowers()
  }, [])

  function fetchLoans() {
    const token = sessionStorage.getItem('token')
    setLoading(true)
    apiServices
      .getallLoans({ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          setLoans(res?.data || [])
        } else {
          toast.error(res?.message || 'Failed to load loans.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while loading loans.')
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
        // non-critical for dropdown/filter; fail silently
      })
  }

  function fetchBorrowers() {
    const token = sessionStorage.getItem('token')
    apiServices
      .getallBorrowers({ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) setBorrowers(res?.data || [])
      })
      .catch(() => {
        // non-critical for dropdown; fail silently
      })
  }

  const filtered = loans.filter((l) => {
    const matchesQuery =
      (l.loanNumber || '').toLowerCase().includes(query.toLowerCase()) ||
      (l.borrowerId?.name || '').toLowerCase().includes(query.toLowerCase())
    const matchesType = loanTypeFilter === 'All' || l.loanTypeId?._id === loanTypeFilter || l.loanTypeId === loanTypeFilter
    const matchesStatus = statusFilter === 'All' || l.loanStatus === statusFilter
    return matchesQuery && matchesType && matchesStatus
  })

  function resetForm() {
    setBorrowerId('')
    setLoanTypeId('')
    setLoanAmount('')
    setInterestRate('')
    setInterestAmount('')
    setPrincipalAmount('')
    setTotalPayableAmount('')
    setInstallmentAmount('')
    setTotalInstallments('')
    setLoanStartDate('')
    setFirstInstallmentDate('')
    setMaturityDate('')
    setSecurity('')
  }

  useEffect(() => {
    if (!showModal) resetForm()
  }, [showModal])

  function openAdd() {
    setEditingId(null)
    resetForm()
    setShowModal(true)
  }

  function openEdit(loan) {
    setEditingId(loan._id)
    setBorrowerId(loan.borrowerId?._id || loan.borrowerId || '')
    setLoanTypeId(loan.loanTypeId?._id || loan.loanTypeId || '')
    setLoanAmount(loan.loanAmount ?? '')
    setInterestRate(loan.interestRate ?? '')
    setInterestAmount(loan.interestAmount ?? '')
    setPrincipalAmount(loan.principalAmount ?? '')
    setTotalPayableAmount(loan.totalPayableAmount ?? '')
    setInstallmentAmount(loan.installmentAmount ?? '')
    setTotalInstallments(loan.totalInstallments ?? '')
    setLoanStartDate(loan.loanStartDate ? loan.loanStartDate.substring(0, 10) : '')
    setFirstInstallmentDate(loan.firstInstallmentDate ? loan.firstInstallmentDate.substring(0, 10) : '')
    setMaturityDate(loan.maturityDate ? loan.maturityDate.substring(0, 10) : '')
    setSecurity(loan.security || '')
    setShowModal(true)
  }

  function handleSave(e) {
    e.preventDefault()

    const token = sessionStorage.getItem('token')
    const currentUserId = sessionStorage.getItem('adminId') || sessionStorage.getItem('subAdminId')

    const payload = {
      borrowerId,
      loanTypeId,
      loanAmount: Number(loanAmount) || 0,
      interestRate: Number(interestRate) || 0,
      interestAmount: Number(interestAmount) || 0,
      principalAmount: Number(principalAmount) || 0,
      totalPayableAmount: Number(totalPayableAmount) || 0,
      installmentAmount: Number(installmentAmount) || 0,
      totalInstallments: Number(totalInstallments) || 0,
      loanStartDate,
      firstInstallmentDate,
      maturityDate: maturityDate || null,
      security,
    }

    if (editingId) {
      payload._id = editingId
      payload.updatedById = currentUserId

      apiServices
        .updateLoan(payload, { headers: { authorization: token } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Loan updated successfully.')
            setShowModal(false)
            fetchLoans()
          } else {
            toast.error(res?.message || 'Failed to update loan.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    } else {
      payload.addedById = currentUserId

      apiServices
        .addLoan(payload, { headers: { authorization: token } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Loan created successfully.')
            setShowModal(false)
            fetchLoans()
          } else {
            toast.error(res?.message || 'Failed to create loan.')
          }
        })
        .catch((error) => {
          console.error('Add Loan Error:', error?.response?.data)
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    }
  }

  function handleDelete(id) {
    // Backend uses a soft delete (isDelete flag) rather than a hard delete.
    apiServices
      .deleteLoan({ _id: id }, { headers: { authorization: sessionStorage.getItem('token') } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(res.message || 'Loan removed successfully.')
          fetchLoans()
        } else {
          toast.error(res?.message || 'Failed to remove loan.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
      .finally(() => setConfirmDeleteLoan(null))
  }

  function flagPillClass(flag) {
    if (flag === 'Green') return 'pill-green'
    if (flag === 'Yellow') return 'pill-gold'
    if (flag === 'Red' || flag === 'Defaulter') return 'pill-red'
    return 'pill-navy'
  }

  function statusPillClass(status) {
    if (status === 'Active' || status === 'Completed') return 'pill-green'
    if (status === 'Defaulted' || status === 'Cancelled') return 'pill-red'
    return 'pill-navy'
  }

  function formatINR(amount) {
    if (amount === undefined || amount === null) return '—'
    return `₹${Number(amount).toLocaleString('en-IN')}`
  }

  return (
    <>
      <SectionHeading
        eyebrow="Lending"
        title="Manage Loans"
        subtitle="Create loans against borrowers and loan types, and track status, flags and repayment progress."
        action={
          <button className="btn btn-gold btn-sm" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i> Add Loan
          </button>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-lg-7">
          <div className="card-surface p-3 h-100">
            <div className="fw-semibold mb-2">Loan Types</div>
            <div className="row g-2">
              <div className="col-md-4">
                <button
                  className={`btn w-100 text-start p-3 ${loanTypeFilter === 'All' ? 'btn-navy' : 'btn-light border'}`}
                  onClick={() => setLoanTypeFilter('All')}
                >
                  <div className="fw-semibold small">All</div>
                  <div className="small mt-1" style={{ opacity: 0.75, fontSize: '0.72rem' }}>Every loan type</div>
                </button>
              </div>
              {loanTypes.map((t) => (
                <div className="col-md-4" key={t._id}>
                  <button
                    className={`btn w-100 text-start p-3 ${loanTypeFilter === t._id ? 'btn-navy' : 'btn-light border'}`}
                    onClick={() => setLoanTypeFilter(loanTypeFilter === t._id ? 'All' : t._id)}
                  >
                    <div className="fw-semibold small">{t.name}</div>
                    <div className="small mt-1 text-capitalize" style={{ opacity: 0.75, fontSize: '0.72rem' }}>{t.frequencyType}</div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card-surface p-3 h-100">
            <div className="fw-semibold mb-2">Loan Status</div>
            <select className="form-control form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              {LOAN_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="fw-semibold mt-3 mb-2">Search</div>
            <input
              className="form-control"
              placeholder="Search by loan number or borrower..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <span className="fw-semibold">
            {filtered.length} Loan{filtered.length !== 1 ? 's' : ''}
            {loanTypeFilter !== 'All' && (
              <span className="text-secondary fw-normal"> · {loanTypes.find((t) => t._id === loanTypeFilter)?.name}</span>
            )}
            {statusFilter !== 'All' && <span className="text-secondary fw-normal"> · {statusFilter}</span>}
          </span>
          {(loanTypeFilter !== 'All' || statusFilter !== 'All' || query) && (
            <button
              className="btn btn-sm btn-light"
              onClick={() => {
                setLoanTypeFilter('All')
                setStatusFilter('All')
                setQuery('')
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-4 text-secondary small">Loading loans...</div>
        ) : filtered.length === 0 ? (
          <EmptyState text="No loans match your search." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Borrower</th>
                <th>Loan Type</th>
                <th>Loan Amount</th>
                <th>Installment</th>
                <th>Status</th>
                <th>Flag</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l._id}>
                  <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="fw-semibold">{l.borrowerId?.name || '—'}</div>
                    <div className="ledger-id">{l.loanNumber}</div>
                  </td>
                  <td className="small">
                    <div>{l.loanTypeId?.name || '—'}</div>
                    <div className="text-secondary text-capitalize">{l.loanTypeId?.frequencyType}</div>
                  </td>
                  <td className="ledger-amount">{formatINR(l.loanAmount)}</td>
                  <td className="ledger-amount">{formatINR(l.installmentAmount)}</td>
                  <td>
                    <span className={`pill ${statusPillClass(l.loanStatus)}`} style={{ border: 'none' }}>
                      {l.loanStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${flagPillClass(l.flag)}`} style={{ border: 'none' }}>
                      {l.flag}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-soft-icon" onClick={() => openEdit(l)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-soft-icon" onClick={() => setConfirmDeleteLoan(l)}>
                        <i className="bi bi-trash text-danger"></i>
                      </button>
                      {l.borrowerId?._id && (
                        <Link to={`/subadmin/borrowers/${l.borrowerId._id}`} className="btn-soft-icon">
                          <i className="bi bi-arrow-up-right"></i>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        title={editingId ? 'Edit Loan' : 'Add Loan'}
        show={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-gold" form="loan-form" type="submit">Save Loan</button>
          </>
        }
      >
        <form id="loan-form" onSubmit={handleSave}>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Borrower</label>
              <select className="form-control" required value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)}>
                <option value="">Select borrower</option>
                {borrowers.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Loan Type</label>
              <select className="form-control" required value={loanTypeId} onChange={(e) => setLoanTypeId(e.target.value)}>
                <option value="">Select loan type</option>
                {loanTypes.map((t) => (
                  <option key={t._id} value={t._id}>{t.name} ({t.frequencyType})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Loan Amount</label>
              <input type="number" min="0" className="form-control" required value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Interest Rate (%)</label>
              <input type="number" min="0" step="0.01" className="form-control" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Interest Amount</label>
              <input type="number" min="0" className="form-control" value={interestAmount} onChange={(e) => setInterestAmount(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Principal Amount</label>
              <input type="number" min="0" className="form-control" value={principalAmount} onChange={(e) => setPrincipalAmount(e.target.value)} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Total Payable Amount</label>
              <input type="number" min="0" className="form-control" value={totalPayableAmount} onChange={(e) => setTotalPayableAmount(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Installment Amount</label>
              <input type="number" min="0" className="form-control" value={installmentAmount} onChange={(e) => setInstallmentAmount(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Total Installments</label>
            <input type="number" min="0" className="form-control" value={totalInstallments} onChange={(e) => setTotalInstallments(e.target.value)} />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-4">
              <label className="form-label small fw-semibold">Loan Start Date</label>
              <input type="date" className="form-control" required value={loanStartDate} onChange={(e) => setLoanStartDate(e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold">First Installment Date</label>
              <input type="date" className="form-control" required value={firstInstallmentDate} onChange={(e) => setFirstInstallmentDate(e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold">Maturity Date</label>
              <input type="date" className="form-control" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Security</label>
            <input className="form-control" value={security} onChange={(e) => setSecurity(e.target.value)} />
          </div>
        </form>
      </Modal>

      <Modal
        title="Remove Loan"
        show={!!confirmDeleteLoan}
        onClose={() => setConfirmDeleteLoan(null)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setConfirmDeleteLoan(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteLoan._id)}>
              Remove
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to remove loan <strong>{confirmDeleteLoan?.loanNumber}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
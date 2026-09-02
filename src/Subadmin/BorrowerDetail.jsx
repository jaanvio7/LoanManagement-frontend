import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'

export default function BorrowerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [borrower, setBorrower] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBorrower()
  }, [id])

  function fetchBorrower() {
    const token = sessionStorage.getItem('token')
    setLoading(true)
    apiServices
      .getsingleBorrower({ _id: id }, { headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          setBorrower(res?.data)
        } else {
          toast.error(res?.message || 'Failed to load borrower details.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while loading borrower details.')
      })
      .finally(() => setLoading(false))
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function filePillClass(status) {
    if (status === 'Available') return 'pill-green'
    if (status === 'Issued') return 'pill-navy'
    if (status === 'Missing') return 'pill-red'
    return 'pill-navy'
  }

  if (loading) {
    return <div className="p-4 text-secondary small">Loading borrower details...</div>
  }

  if (!borrower) {
    return (
      <div className="p-4">
        <button className="btn btn-light btn-sm mb-3" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>
        <div className="text-secondary">Borrower not found.</div>
      </div>
    )
  }

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>
        <div>
          <h4 className="mb-0">{borrower.name}</h4>
          <span className="text-secondary small">Borrower Profile</span>
        </div>
      </div>

      <div className="row g-3">
        {/* Photo + quick facts */}
        <div className="col-12 col-lg-3">
          <div className="p-3" style={{ border: '1px solid var(--border-soft, #e6e9ee)', borderRadius: 10 }}>
            <div className="d-flex flex-column align-items-center text-center">
              {borrower.photo ? (
                <img
                  src={borrower.photo}
                  alt={borrower.name}
                  style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#e6e9ee' }} />
              )}
              <div className="fw-semibold mt-3">{borrower.name}</div>
              <div className="text-secondary small">{borrower.occupation || '—'}</div>
            </div>

            <hr />

            <div className="small">
              <div className="d-flex justify-content-between py-1">
                <span className="text-secondary">CIBIL Score</span>
                <span className="fw-semibold">{borrower.cibilScore ?? '—'}</span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span className="text-secondary">Monthly Income</span>
                <span className="fw-semibold">
                  {borrower.monthlyIncome ? `₹${borrower.monthlyIncome.toLocaleString()}` : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail sections */}
        <div className="col-12 col-lg-9">
          <div className="p-3 mb-3" style={{ border: '1px solid var(--border-soft, #e6e9ee)', borderRadius: 10 }}>
            <h6 className="fw-semibold small text-secondary text-uppercase mb-3">Personal Details</h6>
            <div className="row g-3 small">
              <div className="col-6 col-md-4">
                <div className="text-secondary">Father's Name</div>
                <div className="fw-semibold">{borrower.fatherName || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Mother's Name</div>
                <div className="fw-semibold">{borrower.motherName || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Date of Birth</div>
                <div className="fw-semibold">{formatDate(borrower.dateOfBirth)}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Gender</div>
                <div className="fw-semibold">{borrower.gender || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Aadhaar Number</div>
                <div className="fw-semibold">{borrower.aadhaarNumber || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">PAN Number</div>
                <div className="fw-semibold">{borrower.panNumber || '—'}</div>
              </div>
            </div>
          </div>

          <div className="p-3 mb-3" style={{ border: '1px solid var(--border-soft, #e6e9ee)', borderRadius: 10 }}>
            <h6 className="fw-semibold small text-secondary text-uppercase mb-3">Contact</h6>
            <div className="row g-3 small">
              <div className="col-6 col-md-4">
                <div className="text-secondary">Mobile</div>
                <div className="fw-semibold">{borrower.mobile || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Alternate Mobile</div>
                <div className="fw-semibold">{borrower.alternateMobile || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Email</div>
                <div className="fw-semibold">{borrower.email || '—'}</div>
              </div>
            </div>
          </div>

          <div className="p-3 mb-3" style={{ border: '1px solid var(--border-soft, #e6e9ee)', borderRadius: 10 }}>
            <h6 className="fw-semibold small text-secondary text-uppercase mb-3">Address</h6>
            <div className="row g-3 small">
              <div className="col-12">
                <div className="text-secondary">Address</div>
                <div className="fw-semibold">{borrower.address || '—'}</div>
              </div>
              <div className="col-4">
                <div className="text-secondary">City</div>
                <div className="fw-semibold">{borrower.city || '—'}</div>
              </div>
              <div className="col-4">
                <div className="text-secondary">State</div>
                <div className="fw-semibold">{borrower.state || '—'}</div>
              </div>
              <div className="col-4">
                <div className="text-secondary">Pincode</div>
                <div className="fw-semibold">{borrower.pincode || '—'}</div>
              </div>
            </div>
          </div>

          <div className="p-3" style={{ border: '1px solid var(--border-soft, #e6e9ee)', borderRadius: 10 }}>
            <h6 className="fw-semibold small text-secondary text-uppercase mb-3">File Position</h6>
            <div className="row g-3 small">
              <div className="col-6 col-md-4">
                <div className="text-secondary">File Number</div>
                <div className="fw-semibold">{borrower.filePosition?.fileNumber || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">File Color</div>
                <div className="fw-semibold">{borrower.filePosition?.fileColor || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Rack</div>
                <div className="fw-semibold">{borrower.filePosition?.rack || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Level</div>
                <div className="fw-semibold">{borrower.filePosition?.level || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Physical Location</div>
                <div className="fw-semibold">{borrower.filePosition?.physicalLocation || '—'}</div>
              </div>
              <div className="col-6 col-md-4">
                <div className="text-secondary">Status</div>
                <span className={`pill ${filePillClass(borrower.filePosition?.status)}`} style={{ border: 'none' }}>
                  {borrower.filePosition?.status || 'Available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
import React, { useEffect, useState } from 'react'
import { SectionHeading, EmptyState, Modal } from '../Components/UI.jsx'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const FILE_STATUS_OPTIONS = ['Available', 'Issued', 'Returned', 'Missing']
const GENDER_OPTIONS = ['Male', 'Female', 'Other']

export default function BorrowerProfiles() {
  const navigate = useNavigate()
  const [borrowers, setBorrowers] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Personal details
  const [name, setName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [motherName, setMotherName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [mobile, setMobile] = useState('')
  const [alternateMobile, setAlternateMobile] = useState('')
  const [email, setEmail] = useState('')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [occupation, setOccupation] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [cibilScore, setCibilScore] = useState('')
  const [photo, setPhoto] = useState(null)
  const [previousPhoto, setPreviousPhoto] = useState(null)

  // File Position
  const [fileNumber, setFileNumber] = useState('')
  const [rack, setRack] = useState('')
  const [level, setLevel] = useState('')
  const [fileColor, setFileColor] = useState('')
  const [physicalLocation, setPhysicalLocation] = useState('')
  const [filePositionStatus, setFilePositionStatus] = useState('Available')

  const [confirmDeleteBorrower, setConfirmDeleteBorrower] = useState(null)

  useEffect(() => {
    fetchBorrowers()
  }, [])

  function fetchBorrowers() {
    const token = sessionStorage.getItem('token')
    const subAdminId = sessionStorage.getItem('subAdminId')
    setLoading(true)
    apiServices
      .getallBorrowers({ addedById: subAdminId },{ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          setBorrowers(res?.data || [])
        } else {
          toast.error(res?.message || 'Failed to load borrowers.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while loading borrowers.')
      })
      .finally(() => setLoading(false))
  }

  const filtered = borrowers.filter(
    (b) =>
      (b.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (b.mobile || '').toLowerCase().includes(query.toLowerCase()) ||
      (b.filePosition?.fileNumber || '').toLowerCase().includes(query.toLowerCase())
  )

  function resetForm() {
    setName('')
    setFatherName('')
    setMotherName('')
    setDateOfBirth('')
    setGender('')
    setMobile('')
    setAlternateMobile('')
    setEmail('')
    setAadhaarNumber('')
    setPanNumber('')
    setOccupation('')
    setMonthlyIncome('')
    setAddress('')
    setCity('')
    setState('')
    setPincode('')
    setCibilScore('')
    setPhoto(null)
    setPreviousPhoto(null)
    setFileNumber('')
    setRack('')
    setLevel('')
    setFileColor('')
    setPhysicalLocation('')
    setFilePositionStatus('Available')
  }

  useEffect(() => {
    if (!showModal) resetForm()
  }, [showModal])

  function openAdd() {
    setEditingId(null)
    resetForm()
    setShowModal(true)
  }

  function openEdit(borrower) {
    setEditingId(borrower._id)
    setName(borrower.name || '')
    setFatherName(borrower.fatherName || '')
    setMotherName(borrower.motherName || '')
    setDateOfBirth(borrower.dateOfBirth ? borrower.dateOfBirth.substring(0, 10) : '')
    setGender(borrower.gender || '')
    setMobile(borrower.mobile || '')
    setAlternateMobile(borrower.alternateMobile || '')
    setEmail(borrower.email || '')
    setAadhaarNumber(borrower.aadhaarNumber || '')
    setPanNumber(borrower.panNumber || '')
    setOccupation(borrower.occupation || '')
    setMonthlyIncome(borrower.monthlyIncome ?? '')
    setAddress(borrower.address || '')
    setCity(borrower.city || '')
    setState(borrower.state || '')
    setPincode(borrower.pincode || '')
    setCibilScore(borrower.cibilScore ?? '')
    setPhoto(null)
    setPreviousPhoto(borrower.photo || null)
    setFileNumber(borrower.filePosition?.fileNumber || '')
    setRack(borrower.filePosition?.rack || '')
    setLevel(borrower.filePosition?.level || '')
    setFileColor(borrower.filePosition?.fileColor || '')
    setPhysicalLocation(borrower.filePosition?.physicalLocation || '')
    setFilePositionStatus(borrower.filePosition?.status || 'Available')
    setShowModal(true)
  }

  function handleSave(e) {
    e.preventDefault()

    const token = sessionStorage.getItem('token')
    const currentUserId = sessionStorage.getItem('adminId') || sessionStorage.getItem('subAdminId')

    const fd = new FormData()
    fd.append('name', name)
    fd.append('fatherName', fatherName)
    fd.append('motherName', motherName)
    if (dateOfBirth) fd.append('dateOfBirth', dateOfBirth)
    if (gender) fd.append('gender', gender)
    fd.append('mobile', mobile)
    fd.append('alternateMobile', alternateMobile)
    fd.append('email', email)
    fd.append('aadhaarNumber', aadhaarNumber)
    fd.append('panNumber', panNumber)
    fd.append('occupation', occupation)
    fd.append('monthlyIncome', monthlyIncome || 0)
    fd.append('address', address)
    fd.append('city', city)
    fd.append('state', state)
    fd.append('pincode', pincode)
    if (cibilScore !== '') fd.append('cibilScore', cibilScore)
    if (photo instanceof File) fd.append('photo', photo)

    // filePosition (nested object) — send as JSON string; backend should parse it
    fd.append(
      'filePosition',
      JSON.stringify({
        fileNumber,
        rack,
        level,
        fileColor,
        physicalLocation,
        status: filePositionStatus,
      })
    )

    if (editingId) {
      fd.append('_id', editingId)
      fd.append('updatedById', currentUserId)

      apiServices
        .updateBorrower(fd, { headers: { authorization: token, 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Borrower updated successfully.')
            setShowModal(false)
            fetchBorrowers()
          } else {
            toast.error(res?.message || 'Failed to update borrower.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    } else {
      fd.append('addedById', currentUserId)

      apiServices
        .addBorrower(fd, { headers: { authorization: token, 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Borrower added successfully.')
            setShowModal(false)
            fetchBorrowers()
          } else {
            toast.error(res?.message || 'Failed to add borrower.')
          }
        })
        .catch((error) => {
          console.error('Add Borrower Error:', error?.response?.data)
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    }
  }

  function handleDelete(id) {
    // Backend uses a soft delete (isDelete flag) rather than a hard delete.
    apiServices
      .deleteBorrower({ _id: id }, { headers: { authorization: sessionStorage.getItem('token') } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(res.message || 'Borrower removed successfully.')
          fetchBorrowers()
        } else {
          toast.error(res?.message || 'Failed to remove borrower.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
      .finally(() => setConfirmDeleteBorrower(null))
  }

  function filePillClass(status) {
    if (status === 'Available') return 'pill-green'
    if (status === 'Issued') return 'pill-navy'
    if (status === 'Missing') return 'pill-red'
    return 'pill-navy'
  }

  return (
    <>
      <SectionHeading
        eyebrow="Lending"
        title="Manage Borrower Profile"
        subtitle="General details, contact info, income, and file position — all in one profile."
        action={
          <button className="btn btn-gold btn-sm" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i> Add Borrower
          </button>
        }
      />

      <div className="ledger-table-wrap">
        <div className="table-header-row flex-wrap gap-2">
          <input
            className="form-control form-control-sm"
            style={{ maxWidth: 260 }}
            placeholder="Search by name, mobile or file number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-secondary small">{filtered.length} borrowers</span>
        </div>

        {loading ? (
          <div className="p-4 text-secondary small">Loading borrowers...</div>
        ) : filtered.length === 0 ? (
          <EmptyState text="No borrowers match your search." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Occupation / Income</th>
                <th>File Position</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b._id}>
                  <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                  <td className="small">
                    {b.photo ? (
                      <img
                        src={b.photo}
                        alt="Borrower"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e6e9ee' }} />
                    )}
                  </td>
                  <td>
                    <div className="fw-semibold">{b.name}</div>
                    <div className="text-secondary small">{b.fatherName}</div>
                  </td>
                  <td className="small">
                    <div>{b.mobile}</div>
                    <div className="text-secondary">{b.email}</div>
                  </td>
                  <td className="small">
                    <div>{b.occupation || '—'}</div>
                    <div className="text-secondary">
                      {b.monthlyIncome ? `₹${b.monthlyIncome.toLocaleString()}/mo` : '—'}
                    </div>
                  </td>
                  <td className="small">
                    <div>{b.filePosition?.fileNumber || '—'}</div>
                    <span className={`pill ${filePillClass(b.filePosition?.status)}`} style={{ border: 'none', fontSize: '0.72rem' }}>
                      {b.filePosition?.status || 'Available'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-soft-icon" onClick={() => navigate(`/subadmin/borrowers/${b._id}`)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn-soft-icon" onClick={() => openEdit(b)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-soft-icon" onClick={() => setConfirmDeleteBorrower(b)}>
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
        title={editingId ? 'Edit Borrower' : 'Add Borrower'}
        show={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-gold" form="borrower-form" type="submit">Save Borrower</button>
          </>
        }
      >
        <form id="borrower-form" onSubmit={handleSave}>
          <h6 className="fw-semibold small text-secondary text-uppercase mb-2">Personal Details</h6>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name</label>
            <input className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Father's Name</label>
              <input className="form-control" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Mother's Name</label>
              <input className="form-control" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Date of Birth</label>
              <input type="date" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Gender</label>
              <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <h6 className="fw-semibold small text-secondary text-uppercase mb-2 mt-4">Contact</h6>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Mobile</label>
              <input className="form-control" required value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Alternate Mobile</label>
              <input className="form-control" value={alternateMobile} onChange={(e) => setAlternateMobile(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <h6 className="fw-semibold small text-secondary text-uppercase mb-2 mt-4">Identity & Income</h6>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Aadhaar Number</label>
              <input className="form-control" value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">PAN Number</label>
              <input className="form-control" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Occupation</label>
              <input className="form-control" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Monthly Income</label>
              <input type="number" min="0" className="form-control" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">CIBIL Score</label>
            <input type="number" min="0" max="900" className="form-control" value={cibilScore} onChange={(e) => setCibilScore(e.target.value)} />
          </div>

          <h6 className="fw-semibold small text-secondary text-uppercase mb-2 mt-4">Address</h6>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Address</label>
            <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-4">
              <label className="form-label small fw-semibold">City</label>
              <input className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold">State</label>
              <input className="form-control" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold">Pincode</label>
              <input className="form-control" value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Photo</label>

            {editingId && previousPhoto && (
              <div className="mb-2 d-flex align-items-center gap-2">
                <img
                  src={previousPhoto}
                  alt="Current"
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="text-secondary small">Current photo — choose a file below to replace it</span>
              </div>
            )}

            <input type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
          </div>

          <h6 className="fw-semibold small text-secondary text-uppercase mb-2 mt-4">File Position</h6>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">File Number</label>
              <input className="form-control" value={fileNumber} onChange={(e) => setFileNumber(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">File Color</label>
              <input className="form-control" value={fileColor} onChange={(e) => setFileColor(e.target.value)} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-4">
              <label className="form-label small fw-semibold">Rack</label>
              <input className="form-control" value={rack} onChange={(e) => setRack(e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold">Level</label>
              <input className="form-control" value={level} onChange={(e) => setLevel(e.target.value)} />
            </div>
            <div className="col-4">
              <label className="form-label small fw-semibold">Status</label>
              <select className="form-control" value={filePositionStatus} onChange={(e) => setFilePositionStatus(e.target.value)}>
                {FILE_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Physical Location</label>
            <input className="form-control" value={physicalLocation} onChange={(e) => setPhysicalLocation(e.target.value)} />
          </div>
        </form>
      </Modal>

      <Modal
        title="Remove Borrower"
        show={!!confirmDeleteBorrower}
        onClose={() => setConfirmDeleteBorrower(null)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setConfirmDeleteBorrower(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteBorrower._id)}>
              Remove
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to remove <strong>{confirmDeleteBorrower?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
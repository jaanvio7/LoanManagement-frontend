import React, { useEffect, useState } from 'react'
import { SectionHeading, EmptyState, Modal } from '../Components/UI.jsx'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'

export default function WorkerManagement() {
  const [workers, setWorkers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [roleId, setRoleId] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [password, setPassword] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [previousProfileImage, setPreviousProfileImage] = useState(null)

  const [confirmDeleteWorker, setConfirmDeleteWorker] = useState(null)

  useEffect(() => {
    fetchWorkers()
    fetchRoles()
  }, [])

  function fetchWorkers() {
    const token = sessionStorage.getItem('token')
    setLoading(true)
    apiServices
      .getallWorkers({ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          setWorkers(res?.data || [])
        } else {
          toast.error(res?.message || 'Failed to load workers.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while loading workers.')
      })
      .finally(() => setLoading(false))
  }

  function fetchRoles() {
    const token = sessionStorage.getItem('token')
    apiServices
      .getallRoles({ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          setRoles(res?.data || [])
        }
      })
      .catch(() => {
        // role dropdown is non-critical; fail silently, dropdown just stays empty
      })
  }

  const filtered = workers.filter(
    (w) =>
      (w.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (w.mobile || '').toLowerCase().includes(query.toLowerCase()) ||
      (w.email || '').toLowerCase().includes(query.toLowerCase())
  )

  function resetForm() {
    setName('')
    setEmail('')
    setMobile('')
    setRoleId('')
    setAddress('')
    setCity('')
    setState('')
    setPincode('')
    setPassword('')
    setProfileImage(null)
    setPreviousProfileImage(null)
  }

  useEffect(() => {
    if (!showModal) resetForm()
  }, [showModal])

  function openAdd() {
    setEditingId(null)
    resetForm()
    setShowModal(true)
  }

  function openEdit(worker) {
    setEditingId(worker._id)
    setName(worker.name || '')
    setEmail(worker.email || '')
    setMobile(worker.mobile || '')
    setRoleId(worker.roleId?._id || worker.roleId || '')
    setAddress(worker.address || '')
    setCity(worker.city || '')
    setState(worker.state || '')
    setPincode(worker.pincode || '')
    setProfileImage(null)
    setPreviousProfileImage(worker.profileImage || null)
    setShowModal(true)
  }

  function handleSave(e) {
    e.preventDefault()

    const token = sessionStorage.getItem('token')
    const adminId = sessionStorage.getItem('adminId')

    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', email)
    fd.append('mobile', mobile)
    fd.append('roleId', roleId)
    fd.append('address', address)
    fd.append('city', city)
    fd.append('state', state)
    fd.append('pincode', pincode)
    if (profileImage instanceof File) fd.append('profileImage', profileImage)

    if (editingId) {
      fd.append('_id', editingId)
      fd.append('updatedById', adminId)

      apiServices
        .updateWorker(fd, { headers: { authorization: token, 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Worker updated successfully.')
            setShowModal(false)
            fetchWorkers()
          } else {
            toast.error(res?.message || 'Failed to update worker.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    } else {
      fd.append('password', password)
      fd.append('addedById', adminId)

      apiServices
        .addWorker(fd, { headers: { authorization: token, 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Worker added successfully.')
            setShowModal(false)
            fetchWorkers()
          } else {
            toast.error(res?.message || 'Failed to add worker.')
            console.log('Add Worker Response:', res)
          }
        })
        .catch((error) => {
          console.error('Add Worker Error - Full response data:', error?.response?.data)
          console.error('Add Worker Error - Status:', error?.response?.status)
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    }
  }

  function toggleStatus(w) {
    const token = sessionStorage.getItem('token')
    apiServices
      .updateWorker(
        { _id: w._id, status: w.status === 'Active' ? 'Inactive' : 'Active' },
        { headers: { authorization: token } }
      )
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success('Worker status updated.')
          fetchWorkers()
        } else {
          toast.error(res?.message || 'Failed to update status.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
  }

  function toggleBlock(w) {
    const token = sessionStorage.getItem('token')
    apiServices
      .updateWorker({ _id: w._id, isBlock: !w.isBlock }, { headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(!w.isBlock ? 'Worker blocked.' : 'Worker unblocked.')
          fetchWorkers()
        } else {
          toast.error(res?.message || 'Failed to update block status.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
  }

  function handleDelete(id) {
    // Backend uses a soft delete (isDelete flag) rather than a hard delete.
    apiServices
      .deleteWorker({ _id: id }, { headers: { authorization: sessionStorage.getItem('token') } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(res.message || 'Worker removed successfully.')
          fetchWorkers()
        } else {
          toast.error(res?.message || 'Failed to remove worker.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
      .finally(() => setConfirmDeleteWorker(null))
  }

  return (
    <>
      <SectionHeading
        eyebrow="Field Operations"
        title="Worker Management"
        subtitle="Manage field workers, their roles and assigned regions."
        action={
          <button className="btn btn-gold btn-sm" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i> Add Worker
          </button>
        }
      />

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <input
            className="form-control form-control-sm"
            style={{ maxWidth: 260 }}
            placeholder="Search by name, mobile or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-secondary small">{filtered.length} workers</span>
        </div>

        {loading ? (
          <div className="p-4 text-secondary small">Loading workers...</div>
        ) : filtered.length === 0 ? (
          <EmptyState text="No workers match your search." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Profile</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Status</th>
                <th>Blocked</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w, i) => (
                <tr key={w._id}>
                  <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="fw-semibold">{w.name}</div>
                    <div className="ledger-id">{w.workerAutoId ? `#${w.workerAutoId}` : w._id}</div>
                  </td>
                  <td className="small">
                    {w.profileImage ? (
                      <img
                        src={w.profileImage}
                        alt="Profile"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e6e9ee' }} />
                    )}
                  </td>
                  <td className="small">
                    <div>{w.mobile}</div>
                    <div className="text-secondary">{w.email}</div>
                  </td>
                  <td className="small">
                    <div>{w.city}{w.city && w.state ? ', ' : ''}{w.state}</div>
                    <div className="text-secondary">{w.pincode}</div>
                  </td>
                  <td>
                    <button
                      className={`pill ${w.status === 'Active' ? 'pill-green' : 'pill-navy'}`}
                      style={{ border: 'none' }}
                      onClick={() => toggleStatus(w)}
                    >
                      {w.status}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`pill ${w.isBlock ? 'pill-red' : 'pill-navy'}`}
                      style={{ border: 'none' }}
                      onClick={() => toggleBlock(w)}
                    >
                      {w.isBlock ? 'Blocked' : 'Not Blocked'}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-soft-icon" onClick={() => openEdit(w)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-soft-icon" onClick={() => setConfirmDeleteWorker(w)}>
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
        title={editingId ? 'Edit Worker' : 'Add Worker'}
        show={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-gold" form="worker-form" type="submit">Save Worker</button>
          </>
        }
      >
        <form id="worker-form" onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name</label>
            <input className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">Mobile</label>
              <input className="form-control" required value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {!editingId && (
            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                required={!editingId}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-semibold">Role</label>
            <select className="form-control" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>{r.roleName}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Profile Image</label>

            {editingId && previousProfileImage && (
              <div className="mb-2 d-flex align-items-center gap-2">
                <img
                  src={previousProfileImage}
                  alt="Current profile"
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="text-secondary small">Current image — choose a file below to replace it</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Address</label>
            <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="row g-3">
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
        </form>
      </Modal>

      <Modal
        title="Remove Worker"
        show={!!confirmDeleteWorker}
        onClose={() => setConfirmDeleteWorker(null)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setConfirmDeleteWorker(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteWorker._id)}>
              Remove
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to remove <strong>{confirmDeleteWorker?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
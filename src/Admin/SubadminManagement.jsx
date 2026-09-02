import React, { useEffect, useState } from 'react'
import { SectionHeading, EmptyState, Modal } from '../Components/UI.jsx'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'

const emptyForm = { name: '', email: '', phone: '', password: '', profileImage: '', roleId: '' }

// userType: 1 = Admin, 2 = Sub-Admin, 3 = Worker (per the backend schema)
const SUBADMIN_USER_TYPE = 2

export default function SubadminManagement() {
  const [subadmins, setSubadmins] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [previousProfileImage, setPreviousProfileImage] = useState(null)
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null)

  useEffect(() => {
    fetchSubadmins()
    fetchRoles()
  }, [])

 function fetchSubadmins() {
    const token = sessionStorage.getItem('token')
    setLoading(true)
    apiServices.getallUsers({ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          const onlySubadmins = (res?.data || []).filter((u) => u.userType === SUBADMIN_USER_TYPE)
          setSubadmins(onlySubadmins)
        } else {
          toast.error(res?.message || 'Failed to load subadmins.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while loading subadmins.')
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

  const filtered = subadmins.filter(
    (u) =>
      (u.name || '').toLowerCase().includes(query.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (!showModal) {
      setForm(emptyForm)
      setPreviousProfileImage(null)
    }
  }, [showModal])

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setPreviousProfileImage(null)
    setShowModal(true)
  }

  function openEdit(subadmin) {
    setEditingId(subadmin._id)
    apiServices.getsingleUser({ _id: subadmin._id })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          const userData = res?.data
          setForm({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: '',
            profileImage: '', // keep empty; a File is only set if the user picks a new one
            roleId: userData.roleId?._id || userData.roleId || '',
          })
          setPreviousProfileImage(userData.profileImage || null)
          setShowModal(true)
        } else {
          toast.error(res?.message || 'Failed to fetch subadmin details.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while fetching subadmin details.')
      })
  }

  function handleSave(e) {
    e.preventDefault()
    const token = sessionStorage.getItem('token')

    if (editingId) {
      const fd = new FormData()
      fd.append('_id', editingId)
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('phone', form.phone)
      fd.append('role', form.roleId)
      if (form.password) fd.append('password', form.password) // only send if being reset
      if (form.profileImage instanceof File) fd.append('profileImage', form.profileImage) // only append if a new file was picked

      apiServices
        .updateUser(fd, { headers: { authorization: token, 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Subadmin updated successfully.')
            setShowModal(false)
            fetchSubadmins()
          } else {
            toast.error(res?.message || 'Failed to update subadmin.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    } else {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('phone', form.phone)
      fd.append('password', form.password)
      fd.append('role', form.roleId)
      fd.append('userType', SUBADMIN_USER_TYPE)
      fd.append('addedById', sessionStorage.getItem('adminId'))
      if (form.profileImage instanceof File) fd.append('profileImage', form.profileImage)

      apiServices
        .addUser(fd, { headers: { authorization: token, 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Subadmin added successfully.')
            setShowModal(false)
            fetchSubadmins()
          } else {
            toast.error(res?.message || 'Failed to add subadmin.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    }
  }

  function toggleStatus(u) {
    apiServices
      .updateUser(u._id, { status: !u.status })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(`Subadmin marked ${!u.status ? 'active' : 'inactive'}.`)
          fetchSubadmins()
        } else {
          toast.error(res?.message || 'Failed to update status.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
  }

  function toggleBlock(u) {
    apiServices
      .updateUser(u._id, { isBlocked: !u.isBlocked })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(!u.isBlocked ? 'Subadmin blocked.' : 'Subadmin unblocked.')
          fetchSubadmins()
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
      .deleteUser({_id: id})
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          toast.success(res.message || 'Subadmin removed successfully.')
          fetchSubadmins()
        } else {
          toast.error(res?.message || 'Failed to remove subadmin.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
      .finally(() => setConfirmDeleteUser(null))
  }

  return (
    <>
      <SectionHeading
        eyebrow="Access Control"
        title="Add & Manage Subadmins"
        subtitle="Subadmins run day-to-day lending operations — loans, borrowers, workers, penalties and NOCs."
        action={
          <button className="btn btn-gold btn-sm" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i> Add Subadmin
          </button>
        }
      />

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <input
            className="form-control form-control-sm"
            style={{ maxWidth: 260 }}
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-secondary small">{filtered.length} subadmins</span>
        </div>

        {loading ? (
          <div className="p-4 text-secondary small">Loading subadmins...</div>
        ) : filtered.length === 0 ? (
          <EmptyState text="No subadmins match your search." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Profile Image</th>
                <th>Contact</th>
                <th>Blocked</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((u, i) => (
                <tr key={u._id}>
                  <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="fw-semibold">{u.name}</div>
                    <div className="ledger-id">{u.userAutoId ? `#${u.userAutoId}` : u._id}</div>
                  </td>
                  <td className="small">
                    {u.profileImage ? (
                      <img
                        src={u.profileImage}
                        alt="Profile"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e6e9ee' }} />
                    )}
                  </td>
                  <td className="small">
                    <div>{u.email}</div>
                    <div className="text-secondary">{u.phone}</div>
                  </td>

                  <td>
                    <button className={`pill ${u.isBlocked ? 'pill-red' : 'pill-navy'}`} style={{ border: 'none' }} >
                      {u.isBlocked ? 'Blocked' : 'Not Blocked'}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-soft-icon" onClick={() => openEdit(u)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-soft-icon" onClick={() => setConfirmDeleteUser(u)}>
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
        title={editingId ? 'Edit Subadmin' : 'Add Subadmin'}
        show={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-gold" form="subadmin-form" type="submit">Save Subadmin</button>
          </>
        }
      >
        <form id="subadmin-form" onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name</label>
            <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Role</label>
            <select
              className="form-control"
              required
              value={form.roleId}
              onChange={(e) => setForm({ ...form, roleId: e.target.value })}
            >
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
              required={!editingId}
              onChange={(e) => setForm({ ...form, profileImage: e.target.files[0] })}
            />
          </div>
          <div className="row g-3">
            <div className={editingId ? 'col-12' : 'col-7'}>
              <label className="form-label small fw-semibold">Phone</label>
              <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            {!editingId && (
              <div className="col-5">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required={!editingId}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        title="Remove Subadmin"
        show={!!confirmDeleteUser}
        onClose={() => setConfirmDeleteUser(null)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setConfirmDeleteUser(null)}>Cancel</button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(confirmDeleteUser._id)}
            >
              Remove
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to remove <strong>{confirmDeleteUser?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
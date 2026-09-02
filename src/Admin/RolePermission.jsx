import React, { useEffect, useState } from 'react'
import { SectionHeading, EmptyState, Modal } from '../Components/UI.jsx'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'

export default function RolePermission() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [roleName, setRoleName] = useState('')
  const [permissions, setPermissions] = useState([])
  const [permissionInput, setPermissionInput] = useState('')

  const [confirmDeleteRole, setConfirmDeleteRole] = useState(null)

  useEffect(() => {
    fetchRoles()
  }, [])

  function fetchRoles() {
    const token = sessionStorage.getItem('token')
    setLoading(true)
    apiServices
      .getallRoles({ headers: { authorization: token } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
          setRoles(res?.data || [])
        } else {
          toast.error(res?.message || 'Failed to load roles.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong while loading roles.')
      })
      .finally(() => setLoading(false))
  }

  const filtered = roles.filter((r) =>
    (r.roleName || '').toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (!showModal) {
      setRoleName('')
      setPermissions([])
      setPermissionInput('')
    }
  }, [showModal])

  function openAdd() {
    setEditingId(null)
    setRoleName('')
    setPermissions([])
    setShowModal(true)
  }

  function openEdit(role) {
    setEditingId(role._id)
    setRoleName(role.roleName || '')
    setPermissions(Array.isArray(role.permissions) ? [...role.permissions] : [])
    setShowModal(true)
  }

  function addPermission() {
    const value = permissionInput.trim()
    if (!value) return
    if (permissions.includes(value)) {
      setPermissionInput('')
      return
    }
    setPermissions([...permissions, value])
    setPermissionInput('')
  }

  function removePermission(value) {
    setPermissions(permissions.filter((p) => p !== value))
  }

  function handlePermissionKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addPermission()
    }
  }

  function handleSave(e) {
    e.preventDefault()

    const token = sessionStorage.getItem('token')
    const adminId = sessionStorage.getItem('adminId')

    if (editingId) {
      const payload = {
        _id: editingId,
        roleName,
        permissions,
        updatedById: adminId,
      }

      apiServices
        .updateRole(payload, { headers: { authorization: token } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Role updated successfully.')
            setShowModal(false)
            fetchRoles()
          } else {
            toast.error(res?.message || 'Failed to update role.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    } else {
      const payload = {
        roleName,
        permissions,
        addedById: adminId,
      }

      apiServices
        .addRole(payload, { headers: { authorization: token } })
        .then((response) => {
          const res = response?.data
          if (res?.success === true) {
            toast.success('Role added successfully.')
            setShowModal(false)
            fetchRoles()
          } else {
            toast.error(res?.message || 'Failed to add role.')
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Something went wrong.')
        })
    }
  }

 

  function handleDelete(id) {
    // Backend uses a soft delete (isDelete flag) rather than a hard delete.
    apiServices
      .deleteRole({_id: id}, { headers: { authorization: sessionStorage.getItem('token') } })
      .then((response) => {
        const res = response?.data
        if (res?.success === true) {
             fetchRoles()
          toast.success(res.message || 'Role removed successfully.')
         
        } else {
          toast.error(res?.message || 'Failed to remove role.')
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong.')
      })
      .finally(() => setConfirmDeleteRole(null))
  }

  function isActive(status) {
    return status === true || status === 'true'
  }

  return (
    <>
      <SectionHeading
        eyebrow="Access Control"
        title="Role & Permission Management"
        subtitle="Define roles and the permissions each role is allowed to perform across the system."
        action={
          <button className="btn btn-gold btn-sm" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i> Add Role
          </button>
        }
      />

      <div className="ledger-table-wrap">
        <div className="table-header-row">
          <input
            className="form-control form-control-sm"
            style={{ maxWidth: 260 }}
            placeholder="Search by role name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-secondary small">{filtered.length} roles</span>
        </div>

        {loading ? (
          <div className="p-4 text-secondary small">Loading roles...</div>
        ) : filtered.length === 0 ? (
          <EmptyState text="No roles match your search." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Role Name</th>
                <th>Permissions</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r._id}>
                  <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="fw-semibold">{r.roleName}</div>
                  </td>
                  <td className="small">
                    <div className="d-flex flex-wrap gap-1">
                      {Array.isArray(r.permissions) && r.permissions.length > 0 ? (
                        r.permissions.map((p, idx) => (
                          <span key={idx} className="pill pill-navy" style={{ fontSize: '0.72rem' }}>
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-secondary">No permissions assigned</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`pill ${isActive(r.status) ? 'pill-green' : 'pill-navy'}`}
                      style={{ border: 'none' }}
                      onClick={() => toggleStatus(r)}
                    >
                      {isActive(r.status) ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-soft-icon" onClick={() => openEdit(r)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-soft-icon" onClick={() => setConfirmDeleteRole(r)}>
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
        title={editingId ? 'Edit Role' : 'Add Role'}
        show={showModal}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-gold" form="role-form" type="submit">Save Role</button>
          </>
        }
      >
        <form id="role-form" onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Role Name</label>
            <input
              className="form-control"
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Permissions</label>
            <div className="d-flex gap-2 mb-2">
              <input
                className="form-control"
                placeholder="Type a permission and press Enter"
                value={permissionInput}
                onChange={(e) => setPermissionInput(e.target.value)}
                onKeyDown={handlePermissionKeyDown}
              />
              <button type="button" className="btn btn-light" onClick={addPermission}>
                Add
              </button>
            </div>

            {permissions.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {permissions.map((p, idx) => (
                  <span
                    key={idx}
                    className="pill pill-navy d-flex align-items-center gap-1"
                    style={{ border: 'none' }}
                  >
                    {p}
                    <i
                      className="bi bi-x-lg"
                      style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                      onClick={() => removePermission(p)}
                    ></i>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-secondary small">No permissions added yet.</div>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        title="Remove Role"
        show={!!confirmDeleteRole}
        onClose={() => setConfirmDeleteRole(null)}
        footer={
          <>
            <button className="btn btn-light" onClick={() => setConfirmDeleteRole(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteRole._id)}>
              Remove
            </button>
          </>
        }
      >
        <p className="mb-0">
          Are you sure you want to remove <strong>{confirmDeleteRole?.roleName}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
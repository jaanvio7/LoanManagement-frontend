import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, DEFAULT_NAMES } from '../Store/auth.js'
import apiServices from '../APISERVICES/apiServices.js'
import { toast } from 'react-toastify'
const ROLES = [
  { key: 'admin', label: 'Admin', icon: 'bi-shield-lock', home: '/admin' },
  { key: 'subadmin', label: 'Subadmin', icon: 'bi-person-badge', home: '/subadmin' },
  { key: 'worker', label: 'Worker', icon: 'bi-person-workspace', home: '/worker' },
]

export default function Login() {
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleRoleChange(r) {
    setRole(r)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)

    const data = { email, password }

    apiServices.login(data)
      .then((response) => {
        console.log('Login Response:', response)
        const res = response?.data

        if (res?.success !== true) {
          toast.error(res?.message || 'Invalid name or password.')
          return
        }

        const user = res?.data
        if (!user) {
          toast.error('Unexpected response from server.')
          return
        }

        if (user.isBlocked === true) {
          toast.error('Your account is blocked. Please contact administrator.')
          return
        }

        const token = res?.token
        if (!token) {
          console.warn('Login succeeded but no token was returned:', res)
          toast.error('Login failed — no token received. Contact support.')
          return
        }

        if (user.userType === 1) {
          sessionStorage.setItem('adminId', user._id)
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('userType', user.userType)
          console.log("User Token:",sessionStorage.getItem('token'))
          login('admin', user.name || DEFAULT_NAMES.admin)
          toast.success('Admin login successful!')
          navigate('/admin')
        } else if (user.userType === 2) {
          sessionStorage.setItem('subAdminId', user._id)
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('userType', user.userType)

          login('subadmin', user.name || DEFAULT_NAMES.subadmin)
          toast.success('Subadmin login successful!')
          navigate('/subadmin')
        } else if (user.userType === 3) {
          sessionStorage.setItem('workerId', user._id)
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('userType', user.userType)

          login('worker', user.name || DEFAULT_NAMES.worker)
          toast.success('Worker login successful!')
          navigate('/worker')
        } else {
          toast.error('Invalid user type.')
        }
      })
      .catch((error) => {
        console.log('Login Error:', error)
        toast.error(
          error?.response?.data?.message ||
          'Something went wrong. Please try again.'
        )
      })
      .finally(() => setSubmitting(false))
  }

  const roleLabel = ROLES.find((r) => r.key === role).label

  return (
    <div className="login-shell">
      <div className="login-visual d-none d-lg-flex">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="d-flex align-items-center gap-2 mb-5">
            <div className="sidebar-brand-mark">LF</div>
            <div>
              <div className="sidebar-brand-text">LedgerFlow</div>
              <div className="sidebar-brand-sub">Loan Management System</div>
            </div>
          </div>

          <h1 style={{ color: '#fff', fontSize: '2.4rem', maxWidth: 480, lineHeight: 1.2 }}>
            Every kisht, every ledger,
            <br />
            one register.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 440, fontSize: '0.95rem' }}>
            Track daily, weekly and monthly loans, borrower security, penalties and field collections —
            from disbursement to case close, in one place.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }} className="row g-3">
          {[
            ['bi-people', 'Role-based access'],
            ['bi-geo-alt', 'Field-verified locations'],
            ['bi-flag', 'Automatic defaulter flags'],
          ].map(([icon, label]) => (
            <div className="col-12 col-sm-4" key={label}>
              <div
                className="p-3"
                style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <i className={`bi ${icon}`} style={{ color: 'var(--gold)' }}></i>
                <div style={{ color: '#e6e9ee', fontSize: '0.82rem', marginTop: 6 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <div className="d-flex d-lg-none align-items-center gap-2 mb-4">
            <div className="sidebar-brand-mark">LF</div>
            <div>
              <div className="sidebar-brand-text" style={{ color: 'var(--navy-900)' }}>
                LedgerFlow
              </div>
              <div className="sidebar-brand-sub" style={{ color: 'var(--ink-soft)' }}>
                Loan Management System
              </div>
            </div>
          </div>

          <h4 className="mb-1">Sign in to your panel</h4>
          <p className="text-secondary small mb-4">Select your role to continue.</p>

          <div className="role-toggle mb-4">
            {ROLES.map((r) => (
              <button key={r.key} type="button" className={role === r.key ? 'active' : ''} onClick={() => handleRoleChange(r.key)}>
                <i className={`bi ${r.icon} me-1`}></i> {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
             
            </div>
            <button type="submit" className="btn btn-gold w-100 py-2" disabled={submitting}>
              {submitting ? 'Signing in…' : `Continue as ${roleLabel}`}
              {!submitting && <i className="bi bi-arrow-right ms-2"></i>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
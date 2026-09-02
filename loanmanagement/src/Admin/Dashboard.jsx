import React from 'react'
import { Link } from 'react-router-dom'
import { StatCard, formatINR } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'
import { useAuth } from '../Store/auth.js'

export default function Dashboard() {
  const { store } = useData()
  const { user } = useAuth()
  const { borrowers, users } = store

  const subadmins = users.filter((u) => u.role === 'Subadmin')
  const workers = users.filter((u) => u.role === 'Worker')
  const totalPrincipal = borrowers.reduce((s, b) => s + Number(b.principal || 0), 0)
  const activeLoans = borrowers.filter((b) => b.status === 'Active').length

  return (
    <>
      <div className="section-eyebrow">Owner Overview</div>
      <h4 className="mb-4">Good to see you back, {user?.name?.split(' ')[0]}</h4>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard label="Subadmins" value={subadmins.length} icon="bi-person-badge" accent="navy" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Workers" value={workers.length} icon="bi-people" accent="emerald" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Active Loans" value={activeLoans} icon="bi-journal-check" accent="gold" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Portfolio Outstanding" value={formatINR(totalPrincipal)} icon="bi-cash-coin" accent="rose" />
        </div>
      </div>

      <div className="card-surface p-3">
        <div className="fw-semibold mb-2">Quick Actions</div>
        <div className="d-grid gap-2" style={{ maxWidth: 360 }}>
          <Link to="/admin/subadmins" className="btn btn-outline-navy btn-sm text-start">
            <i className="bi bi-person-plus me-2"></i>Add a subadmin
          </Link>
          <Link to="/admin/workers" className="btn btn-outline-navy btn-sm text-start">
            <i className="bi bi-people me-2"></i>View workers
          </Link>
          <Link to="/admin/loans" className="btn btn-outline-navy btn-sm text-start">
            <i className="bi bi-cash-coin me-2"></i>View loans
          </Link>
        </div>
      </div>
    </>
  )
}

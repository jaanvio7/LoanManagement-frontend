import React from 'react'
import { Link } from 'react-router-dom'
import { StatCard, FlagPill, StatusPill, formatINR } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'
import { useAuth } from '../Store/auth.js'

export default function Dashboard() {
  const { store } = useData()
  const { user } = useAuth()
  const { borrowers, collections, caseCloseRequests, depositRequests, users } = store

  const totalPrincipal = borrowers.reduce((s, b) => s + Number(b.principal || 0), 0)
  const overdueCount = borrowers.filter((b) => b.flag === 'red').length
  const activeLoans = borrowers.filter((b) => b.status === 'Active').length
  const todaysCollection = collections.filter((c) => c.date === '2026-08-25').reduce((s, c) => s + Number(c.amount), 0)
  const pendingCaseClose = caseCloseRequests.filter((c) => c.status === 'Pending').length
  const pendingDeposits = depositRequests.filter((d) => d.status === 'Pending').length
  const workerCount = users.filter((u) => u.role === 'Worker').length

  return (
    <>
      <div className="section-eyebrow">Subadmin Overview</div>
      <h4 className="mb-4">Welcome back, {user?.name?.split(' ')[0]}</h4>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard label="Portfolio Outstanding" value={formatINR(totalPrincipal)} icon="bi-cash-coin" accent="navy" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Active Loans" value={activeLoans} icon="bi-journal-check" accent="emerald" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Collected Today" value={formatINR(todaysCollection)} icon="bi-wallet2" accent="gold" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Red-Flag Defaulters" value={overdueCount} icon="bi-flag" accent="rose" />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="ledger-table-wrap mb-3">
            <div className="table-header-row">
              <span className="fw-semibold">Borrower Watchlist</span>
              <Link to="/subadmin/reports/defaulters" className="small text-decoration-none" style={{ color: 'var(--gold)' }}>
                View defaulters <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <table className="ledger">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Borrower</th>
                  <th>Firm</th>
                  <th>Outstanding</th>
                  <th>Flag</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowers.slice(0, 5).map((b, i) => (
                  <tr key={b.id}>
                    <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                    <td>
                      <Link to={`/subadmin/borrowers/${b.id}`} className="text-decoration-none fw-semibold" style={{ color: 'var(--navy-900)' }}>
                        {b.name}
                      </Link>
                      <div className="ledger-id">{b.id}</div>
                    </td>
                    <td className="small">{b.firm}</td>
                    <td className="ledger-amount">{formatINR(b.principal)}</td>
                    <td><FlagPill flag={b.flag} /></td>
                    <td><StatusPill status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card-surface p-3 mb-3">
            <div className="fw-semibold mb-2">Pending Approvals</div>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'var(--hairline)' }}>
              <div>
                <div className="small fw-semibold">Case Close Requests</div>
                <div className="text-secondary small">Raised by field workers</div>
              </div>
              <Link to="/subadmin/case-close" className="pill pill-yellow text-decoration-none">
                {pendingCaseClose} pending
              </Link>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <div>
                <div className="small fw-semibold">Deposit Requests</div>
                <div className="text-secondary small">Worker cash to be approved</div>
              </div>
              <Link to="/subadmin/deposits" className="pill pill-yellow text-decoration-none">
                {pendingDeposits} pending
              </Link>
            </div>
          </div>

          <div className="card-surface p-3">
            <div className="fw-semibold mb-2">Quick Actions</div>
            <div className="d-grid gap-2">
              <Link to="/subadmin/borrowers" className="btn btn-outline-navy btn-sm text-start">
                <i className="bi bi-person-plus me-2"></i>Add borrower profile
              </Link>
              <Link to="/subadmin/workers" className="btn btn-outline-navy btn-sm text-start">
                <i className="bi bi-people me-2"></i>Manage workers ({workerCount})
              </Link>
              <Link to="/subadmin/noc" className="btn btn-outline-navy btn-sm text-start">
                <i className="bi bi-file-earmark-check me-2"></i>Issue an NOC
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

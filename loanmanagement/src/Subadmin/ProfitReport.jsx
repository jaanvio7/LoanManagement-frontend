import React, { useState } from 'react'
import { SectionHeading, formatINR } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'

const TABS = ['Profits', 'In / Out (Market)']

export default function ProfitReport() {
  const { store } = useData()
  const [tab, setTab] = useState('Profits')
  const { borrowers, collections } = store

  const totalOut = borrowers.reduce((s, b) => s + Number(b.principal), 0)
  const totalIn = collections.reduce((s, c) => s + Number(c.amount), 0)
  const interestEarned = borrowers.reduce((s, b) => s + (b.principal * b.interestRate) / 100, 0)

  return (
    <>
      <SectionHeading eyebrow="Reports" title="Profit Report" subtitle="Profits, and money moving in and out of the market." />

      <ul className="nav nav-tabs mb-3 flex-nowrap overflow-auto">
        {TABS.map((t) => (
          <li className="nav-item" key={t}>
            <button className={`nav-link ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ whiteSpace: 'nowrap' }}>
              {t}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'Profits' && (
        <div className="row g-3">
          <div className="col-md-4">
            <div className="stat-card" style={{ '--accent': 'var(--emerald)', '--accent-soft': 'var(--emerald-soft)' }}>
              <div className="stat-card-label">Interest Earned (est.)</div>
              <div className="stat-card-value">{formatINR(interestEarned)}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-card-label">Total Collected</div>
              <div className="stat-card-value">{formatINR(totalIn)}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card" style={{ '--accent': 'var(--navy-700)', '--accent-soft': '#e7ecf3' }}>
              <div className="stat-card-label">Portfolio Disbursed</div>
              <div className="stat-card-value">{formatINR(totalOut)}</div>
            </div>
          </div>

          <div className="col-12">
            <div className="ledger-table-wrap mt-2">
              <div className="table-header-row"><span className="fw-semibold">Profit by Borrower</span></div>
              <table className="ledger">
                <thead>
                  <tr><th>#</th><th>Borrower</th><th>Principal</th><th>Rate</th><th>Est. Interest</th></tr>
                </thead>
                <tbody>
                  {borrowers.map((b, i) => (
                    <tr key={b.id}>
                      <td className="ledger-serial">{i + 1}</td>
                      <td className="fw-semibold">{b.name}</td>
                      <td className="ledger-amount">{formatINR(b.principal)}</td>
                      <td className="small">{b.interestRate}%</td>
                      <td className="ledger-amount" style={{ color: 'var(--emerald)' }}>{formatINR((b.principal * b.interestRate) / 100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'In / Out (Market)' && (
        <div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="stat-card" style={{ '--accent': 'var(--rose)', '--accent-soft': 'var(--rose-soft)' }}>
                <div className="stat-card-label">Kinna Market Ch Ditta (Disbursed)</div>
                <div className="stat-card-value">{formatINR(totalOut)}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="stat-card" style={{ '--accent': 'var(--emerald)', '--accent-soft': 'var(--emerald-soft)' }}>
                <div className="stat-card-label">Kinna Market Cho Aya (Recovered)</div>
                <div className="stat-card-value">{formatINR(totalIn)}</div>
              </div>
            </div>
          </div>
          <div className="ledger-table-wrap">
            <div className="table-header-row"><span className="fw-semibold">Recent Collections</span></div>
            <table className="ledger">
              <thead><tr><th>#</th><th>Receipt</th><th>Borrower</th><th>Date</th><th>Mode</th><th>Amount</th></tr></thead>
              <tbody>
                {collections.map((c, i) => (
                  <tr key={c.id}>
                    <td className="ledger-serial">{i + 1}</td>
                    <td className="ledger-id">{c.id}</td>
                    <td className="fw-semibold">{c.borrowerName}</td>
                    <td className="small">{c.date}</td>
                    <td className="small">{c.mode}</td>
                    <td className="ledger-amount">{formatINR(c.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

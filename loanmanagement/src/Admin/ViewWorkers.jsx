import React, { useState } from 'react'
import { SectionHeading, StatusPill, EmptyState } from '../Components/UI.jsx'
import { useData } from '../Store/data.js'

export default function ViewWorkers() {
  const { store } = useData()
  const [query, setQuery] = useState('')

  const workers = store.users.filter(
    (u) => u.role === 'Worker' && (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <>
      <SectionHeading
        eyebrow="Overview"
        title="View Workers"
        subtitle="All field workers currently added by subadmins across the organisation."
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
          <span className="text-secondary small">{workers.length} workers</span>
        </div>

        {workers.length === 0 ? (
          <EmptyState text="No workers match your search." />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((u, i) => (
                <tr key={u.id}>
                  <td className="ledger-serial">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="fw-semibold">{u.name}</div>
                    <div className="ledger-id">{u.id}</div>
                  </td>
                  <td className="small">
                    <div>{u.email}</div>
                    <div className="text-secondary">{u.phone}</div>
                  </td>
                  <td><StatusPill status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

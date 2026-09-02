import React from 'react'

// Only needs the list of location logs for this borrower.
export default function LocationLogCard({ logs }) {
  return (
    <div className="card-surface p-4">
      <div className="section-eyebrow">Location Verification Log</div>
      {logs.length === 0 ? (
        <p className="text-secondary small mb-0">No location visits logged yet.</p>
      ) : (
        logs.map((l) => (
          <div key={l.id} className="d-flex justify-content-between py-2 border-bottom" style={{ borderColor: 'var(--hairline)' }}>
            <div>
              <div className="small fw-semibold">{l.address}</div>
              <div className="text-secondary small">{l.note}</div>
            </div>
            <div className="text-end small text-secondary">
              {l.date}
              <div>{l.loggedBy}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

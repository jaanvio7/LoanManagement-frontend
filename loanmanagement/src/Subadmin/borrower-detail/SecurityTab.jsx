import React from 'react'

const ITEMS = [
  { key: 'vehicle', label: 'Vehicle', icon: 'bi-car-front-fill' },
  { key: 'property', label: 'Property', icon: 'bi-house-door-fill' },
  { key: 'jewellery', label: 'Jewellery', icon: 'bi-gem' },
]

// Only needs the borrower record. Nothing else.
export default function SecurityTab({ borrower }) {
  return (
    <div className="card-surface p-4">
      <div className="section-eyebrow">Security Manage — Remarks</div>
      <div className="row g-3">
        {ITEMS.map((item) => (
          <div className="col-md-4" key={item.key}>
            <div className="border rounded-3 p-3 h-100" style={{ borderColor: 'var(--hairline)' }}>
              <i className={`bi ${item.icon} mb-2`} style={{ color: 'var(--gold)' }}></i>
              <div className="small fw-semibold">{item.label}</div>
              <div className="text-secondary small">{borrower.security?.[item.key] || 'Not pledged'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

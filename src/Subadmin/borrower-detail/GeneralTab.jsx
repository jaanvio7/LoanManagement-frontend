import React from 'react'
import Field from './Field.jsx'

// Only needs the borrower record. Nothing else.
export default function GeneralTab({ borrower }) {
  return (
    <div className="card-surface p-4">
      <div className="section-eyebrow">General Details</div>
      <div className="row g-3">
        <Field label="Full Name" value={borrower.name} />
        <Field label="Phone" value={borrower.phone} />
        <Field label="Address" value={borrower.address} full />
        <Field label="Firm" value={borrower.firm} />
        <Field label="Status" value={borrower.status} />
      </div>
    </div>
  )
}

import React from 'react'
import Field from './Field.jsx'

// Only needs the borrower record. Nothing else.
export default function GuarantorTab({ borrower }) {
  return (
    <div className="card-surface p-4">
      <div className="section-eyebrow">Guarantee Person Details</div>
      <div className="row g-3">
        <Field label="Guarantor Name" value={borrower.guarantor?.name} />
        <Field label="Relation" value={borrower.guarantor?.relation} />
        <Field label="Phone" value={borrower.guarantor?.phone} />
        <Field label="Address" value={borrower.guarantor?.address} full />
      </div>
    </div>
  )
}

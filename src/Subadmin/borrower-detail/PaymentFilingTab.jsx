import React from 'react'
import Field from './Field.jsx'

// Only needs the borrower record. Nothing else.
export default function PaymentFilingTab({ borrower }) {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="card-surface p-4">
        <div className="section-eyebrow">Payment Details from Lender — Court Precedence</div>
        <div className="row g-3">
          <Field label="Payment Mode" value={borrower.payment?.mode} />
          <Field label="Reference (UTR / UPI / Cheque No.)" value={borrower.payment?.ref} mono />
        </div>
      </div>
      <div className="card-surface p-4">
        <div className="section-eyebrow">File Position in Office</div>
        <div className="row g-3">
          <Field label="Rack" value={borrower.filePosition?.rack} />
          <Field label="Level" value={borrower.filePosition?.level} />
          <Field label="File Color" value={borrower.filePosition?.color} />
        </div>
      </div>
    </div>
  )
}

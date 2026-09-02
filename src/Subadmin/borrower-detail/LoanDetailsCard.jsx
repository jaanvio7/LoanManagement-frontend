import React from 'react'
import Field from './Field.jsx'
import { formatINR } from '../../Components/UI.jsx'

// Only needs the borrower record. Nothing else.
export default function LoanDetailsCard({ borrower }) {
  return (
    <div className="card-surface p-4">
      <div className="section-eyebrow">Loan Details</div>
      <div className="row g-3">
        <Field label="Loan Type" value={borrower.loanType} />
        <Field label="Pay Frequency" value={borrower.payFrequency} />
        <Field label="Principal" value={formatINR(borrower.principal)} mono />
        <Field label="Interest Rate" value={`${borrower.interestRate}%`} />
        <Field label="Installment Amount" value={formatINR(borrower.installmentAmount)} mono />
        <Field label="Disbursed On" value={borrower.disbursedOn} />
        <Field label="Tenure" value={`${borrower.tenureDays} days`} />
      </div>
    </div>
  )
}

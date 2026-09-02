import React from 'react'
import LoanDetailsCard from './LoanDetailsCard.jsx'
import LedgerCard from './LedgerCard.jsx'
import LocationLogCard from './LocationLogCard.jsx'

export default function LoanTab({ borrower, collections, logs }) {
  return (
    <div className="d-flex flex-column gap-3">
      <LoanDetailsCard borrower={borrower} />
      <LedgerCard borrower={borrower} collections={collections} />
      <LocationLogCard logs={logs} />
    </div>
  )
}

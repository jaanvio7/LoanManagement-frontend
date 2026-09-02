// Simple ledger simulation for the installment schedule (calculation engine).
export default function calcLedger(borrower, collections) {
  const paid = collections.reduce((sum, c) => sum + Number(c.amount), 0)
  const totalDue =
    borrower.installmentAmount *
    (borrower.payFrequency === 'Daily' ? 20 : borrower.payFrequency === 'Weekly' ? 8 : 3)
  const balance = Math.max(totalDue - paid, 0)
  return { paid, totalDue, balance }
}

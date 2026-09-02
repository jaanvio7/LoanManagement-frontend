// Mock seed data — stands in for a real backend. Everything is persisted
// to localStorage on first run via Store/data.js.

// `users` holds every Subadmin and Worker account in the system. Admin is a
// single fixed owner login and isn't part of this managed list. Subadmins
// are added/managed by Admin; Workers are added/managed by Subadmin.
export const seedUsers = [
  { id: 'U-001', name: 'Gaurav Bansal', role: 'Subadmin', email: 'gaurav@ledgerflow.in', phone: '98141-22334', status: 'Active' },
  { id: 'U-002', name: 'Garv Mehta', role: 'Subadmin', email: 'garv@ledgerflow.in', phone: '98142-33445', status: 'Active' },
  { id: 'U-003', name: 'Rakesh Kumar', role: 'Worker', email: 'rakesh@ledgerflow.in', phone: '98143-44556', status: 'Active' },
  { id: 'U-004', name: 'Suman Verma', role: 'Worker', email: 'suman@ledgerflow.in', phone: '98144-55667', status: 'Active' },
  { id: 'U-005', name: 'Deepak Singh', role: 'Worker', email: 'deepak@ledgerflow.in', phone: '98145-66778', status: 'Inactive' },
]

export const firms = ['Gaba Finance', 'Gold Line Finance']

// Loan types are managed by Subadmin ("Add Loan type and manage").
export const seedLoanTypes = [
  { id: 'LT-1', name: 'Interest Based', icon: 'bi-percent', description: 'Standard interest-bearing loan, rate set per profile.' },
  { id: 'LT-2', name: 'Non-Interest Based - Lapsium', icon: 'bi-dash-circle', description: 'Flat lapsium loans with no running interest.' },
]

export const payFrequencies = [
  { key: 'Daily', icon: 'bi-calendar-day', desc: 'Collected every day from the borrower.' },
  { key: 'Weekly', icon: 'bi-calendar-week', desc: 'Collected once every week.' },
  { key: 'Monthly', icon: 'bi-calendar-month', desc: 'Collected once every month.' },
]

// Borrower Profile: Pending amount (leftoverAmount), Loan Description
// (loanType), installments (installmentAmount), colour-wise profile (flag),
// file location (filePosition), payment info (payment).
export const seedBorrowers = [
  {
    id: 'BRW-1001',
    name: 'Harpreet Singh',
    phone: '99140-10001',
    address: 'Model Town, Ludhiana',
    guarantor: { name: 'Balwinder Singh', phone: '99140-10011', relation: 'Brother', address: 'Model Town, Ludhiana' },
    firm: 'Gaba Finance',
    loanType: 'Interest Based',
    payFrequency: 'Daily',
    principal: 50000,
    interestRate: 2,
    disbursedOn: '2026-05-02',
    tenureDays: 100,
    installmentAmount: 550,
    cibilPoints: 742,
    leftoverAmount: 0,
    flag: 'green',
    status: 'Active',
    locationVerified: true,
    assignedWorker: 'Rakesh Kumar',
    security: { vehicle: 'Hero Splendor — PB10 AX 4521', property: '', jewellery: 'Gold chain, 2 rings (approx. 18g)' },
    payment: { mode: 'UPI', ref: 'UPI/482910337761' },
    filePosition: { rack: 'R-3', level: '2', color: 'Green' },
  },
  {
    id: 'BRW-1002',
    name: 'Simran Kaur',
    phone: '99140-10002',
    address: 'Sarabha Nagar, Ludhiana',
    guarantor: { name: 'Jaspreet Kaur', phone: '99140-10022', relation: 'Sister', address: 'Sarabha Nagar, Ludhiana' },
    firm: 'Gold Line Finance',
    loanType: 'Non-Interest Based - Lapsium',
    payFrequency: 'Weekly',
    principal: 80000,
    interestRate: 0,
    disbursedOn: '2026-04-10',
    tenureDays: 200,
    installmentAmount: 2800,
    cibilPoints: 690,
    leftoverAmount: 15000,
    flag: 'yellow',
    status: 'Active',
    locationVerified: true,
    assignedWorker: 'Suman Verma',
    security: { vehicle: '', property: '1 Kanal Agri Land — Khewat 221, Raikot', jewellery: '' },
    payment: { mode: 'Cheque', ref: 'CHQ-004471' },
    filePosition: { rack: 'R-1', level: '1', color: 'Yellow' },
  },
  {
    id: 'BRW-1003',
    name: 'Ramesh Chand',
    phone: '99140-10003',
    address: 'Gill Road, Ludhiana',
    guarantor: { name: 'Suresh Chand', phone: '99140-10033', relation: 'Father', address: 'Gill Road, Ludhiana' },
    firm: 'Gaba Finance',
    loanType: 'Interest Based',
    payFrequency: 'Monthly',
    principal: 150000,
    interestRate: 1.5,
    disbursedOn: '2026-02-18',
    tenureDays: 365,
    installmentAmount: 14500,
    cibilPoints: 610,
    leftoverAmount: 0,
    flag: 'red',
    status: 'Overdue',
    locationVerified: false,
    assignedWorker: 'Deepak Singh',
    security: { vehicle: 'Mahindra Bolero — PB10 CD 9081', property: '', jewellery: '' },
    payment: { mode: 'UTR', ref: 'UTR/HDFC/22910981' },
    filePosition: { rack: 'R-4', level: '3', color: 'Red' },
  },
  {
    id: 'BRW-1004',
    name: 'Neha Arora',
    phone: '99140-10004',
    address: 'Civil Lines, Ludhiana',
    guarantor: { name: 'Vikram Arora', phone: '99140-10044', relation: 'Husband', address: 'Civil Lines, Ludhiana' },
    firm: 'Gold Line Finance',
    loanType: 'Interest Based',
    payFrequency: 'Daily',
    principal: 30000,
    interestRate: 2.5,
    disbursedOn: '2026-06-01',
    tenureDays: 90,
    installmentAmount: 400,
    cibilPoints: 780,
    leftoverAmount: 0,
    flag: 'green',
    status: 'Active',
    locationVerified: true,
    assignedWorker: 'Rakesh Kumar',
    security: { vehicle: '', property: '', jewellery: 'Gold earrings (approx. 6g)' },
    payment: { mode: 'UPI', ref: 'UPI/771029446512' },
    filePosition: { rack: 'R-2', level: '1', color: 'Green' },
  },
]

export const penaltySlabs = [
  { id: 'P-1', principalBand: '₹10,000', dayRange: '1 – 30 Days', perDay: 100 },
  { id: 'P-2', principalBand: '₹10,000', dayRange: '31 – 60 Days', perDay: 200 },
  { id: 'P-3', principalBand: '₹10,000', dayRange: '61 – 90 Days', perDay: 300 },
]

export const seedCollections = [
  { id: 'KST-5001', borrowerId: 'BRW-1001', borrowerName: 'Harpreet Singh', amount: 550, date: '2026-08-25', mode: 'Cash', collectedBy: 'Rakesh Kumar', shared: true },
  { id: 'KST-5002', borrowerId: 'BRW-1002', borrowerName: 'Simran Kaur', amount: 2800, date: '2026-08-24', mode: 'UPI', collectedBy: 'Suman Verma', shared: false },
  { id: 'KST-5003', borrowerId: 'BRW-1004', borrowerName: 'Neha Arora', amount: 400, date: '2026-08-25', mode: 'Cash', collectedBy: 'Rakesh Kumar', shared: true },
]

export const seedLocationLogs = [
  { id: 'LOC-01', borrowerId: 'BRW-1001', borrowerName: 'Harpreet Singh', address: 'Model Town, Ludhiana', loggedBy: 'Rakesh Kumar', date: '2026-08-20', note: 'House verified, family present, matches KYC address.' },
  { id: 'LOC-02', borrowerId: 'BRW-1003', borrowerName: 'Ramesh Chand', address: 'Gill Road, Ludhiana', loggedBy: 'Deepak Singh', date: '2026-08-18', note: 'Shop shut, neighbours confirm borrower shifted. Flagged for review.' },
]

export const seedCaseCloseRequests = [
  { id: 'CC-01', borrowerId: 'BRW-1002', borrowerName: 'Simran Kaur', requestedBy: 'Suman Verma', requestedOn: '2026-08-21', leftoverAmount: 15000, status: 'Pending' },
  { id: 'CC-02', borrowerId: 'BRW-1004', borrowerName: 'Neha Arora', requestedBy: 'Rakesh Kumar', requestedOn: '2026-08-19', leftoverAmount: 0, status: 'Approved' },
]

export const seedDepositRequests = [
  { id: 'DEP-01', worker: 'Rakesh Kumar', amount: 950, date: '2026-08-25', paymentMode: 'Cash', status: 'Pending', approvedBy: '' },
  { id: 'DEP-02', worker: 'Suman Verma', amount: 2800, date: '2026-08-24', paymentMode: 'UPI', status: 'Approved', approvedBy: 'Gaurav' },
]

// NOC records - added/managed by Subadmin, viewable by Worker.
export const seedNocRecords = [
  { id: 'NOC-1001', borrowerId: 'BRW-1004', borrowerName: 'Neha Arora', firm: 'Gold Line Finance', date: '2026-08-15', status: 'Issued' },
]

// Full profile access requests raised by Workers (worker: Add and Manage).
export const seedFullProfileRequests = [
  { id: 'FPR-01', borrowerId: 'BRW-1003', borrowerName: 'Ramesh Chand', requestedBy: 'Deepak Singh', requestedOn: '2026-08-19', status: 'Pending' },
]

// Invoices generated by Workers against a payment collection.
export const seedInvoices = [
  { id: 'INV-1001', borrowerId: 'BRW-1001', borrowerName: 'Harpreet Singh', amount: 550, date: '2026-08-25', generatedBy: 'Rakesh Kumar' },
]

export const seedBackups = [
  { id: 'BKP-01', date: '2026-08-24 02:00', size: '18.4 MB', type: 'Automatic' },
  { id: 'BKP-02', date: '2026-08-17 02:00', size: '18.1 MB', type: 'Manual' },
]

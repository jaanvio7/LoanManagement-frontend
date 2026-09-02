# LedgerFlow — Loan Management System

A React.js (Vite) loan management application built from the Admin/Worker
scenario spec, with two panels:

- **Admin Panel** — User Management, Roles & Permissions, Manage Loans (pay
  frequency + loan types), Borrower Profiles (general/guarantor/loan
  details/calculation engine/security/payment/file position), Penalty
  Management, Flags & Defaulter Reports, Case Close approvals, NOC Handover,
  Loan Agreement printouts, Reports (Profits / In-Out / Defaulters), and
  Database Backup.
- **Worker Panel** — Location Verification (with photo log), Payment
  Collection (Kisht) with share/copy receipt, Visit Remarks, Case Close
  Requests, and Deposit Collection with approval simulation.

## Tech stack

- React 18 + React Router 6 (Vite)
- Bootstrap 5 + Bootstrap Icons (via CDN in `index.html`, fully responsive)
- Mock backend using React Context + `localStorage` (no server needed)

## Getting started

This project was built without internet access, so dependencies are **not**
pre-installed. On your machine, with Node.js 18+ installed:

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Logging in

The login screen has an **Admin / Worker** toggle — pick a role, type any
name and any password, and continue. All data is seeded with realistic
demo borrowers, loans, collections and requests, and persists in your
browser's `localStorage` between sessions. Clear site data (or DevTools →
Application → Local Storage) to reset the demo.

## Notes

- All amounts are in ₹ (INR) and reflect the daily/weekly/monthly, Gaba /
  Gold Line firm scenario from the original spec.
- "Kisht" = installment; "Maff Amount" = waived/left-out amount saved on a
  borrower's profile for the next case-close request.
- The UI/UX system ("LedgerFlow") uses a navy + gold palette with a
  ledger-style table treatment (dashed row rules, monospaced figures) to
  match the register/ledger subject matter.

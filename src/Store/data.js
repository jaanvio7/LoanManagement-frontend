import { useSyncExternalStore } from 'react'
import {
  seedUsers,
  seedBorrowers,
  penaltySlabs,
  seedCollections,
  seedLocationLogs,
  seedCaseCloseRequests,
  seedDepositRequests,
  seedNocRecords,
  seedFullProfileRequests,
  seedInvoices,
  seedBackups,
  seedLoanTypes,
  firms,
} from '../Data/seed.js'

// A plain module-level store - deliberately NOT a React Context. Every
// component that needs data imports { useData } from this file directly.
// State lives in one shared object, changes go through `emit()`, and React
// subscribes to it via useSyncExternalStore. No <Provider> wrapping needed
// anywhere in the tree.

const STORE_KEY = 'lf_store_v2'

function loadInitial() {
  const raw = localStorage.getItem(STORE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch (e) {
      // fall through to seed
    }
  }
  return {
    users: seedUsers,
    borrowers: seedBorrowers,
    penaltySlabs,
    loanTypes: seedLoanTypes,
    collections: seedCollections,
    locationLogs: seedLocationLogs,
    caseCloseRequests: seedCaseCloseRequests,
    depositRequests: seedDepositRequests,
    nocRecords: seedNocRecords,
    fullProfileRequests: seedFullProfileRequests,
    invoices: seedInvoices,
    backups: seedBackups,
    firms,
  }
}

let store = loadInitial()
const listeners = new Set()

function emit() {
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
  listeners.forEach((fn) => fn())
}

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function getSnapshot() {
  return store
}

function update(key, updater) {
  store = { ...store, [key]: updater(store[key]) }
  emit()
}

function resetDemoData() {
  localStorage.removeItem(STORE_KEY)
  store = loadInitial()
  emit()
}

const actions = {
  update,
  resetDemoData,

  // Users (Subadmins + Workers)
  addUser: (u) => update('users', (list) => [{ ...u, id: `U-${String(list.length + 1).padStart(3, '0')}` }, ...list]),
  updateUser: (id, patch) => update('users', (list) => list.map((u) => (u.id === id ? { ...u, ...patch } : u))),
  removeUser: (id) => update('users', (list) => list.filter((u) => u.id !== id)),

  // Loan types
  addLoanType: (t) => update('loanTypes', (list) => [...list, { ...t, id: `LT-${list.length + 1}` }]),
  updateLoanType: (id, patch) => update('loanTypes', (list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t))),
  removeLoanType: (id) => update('loanTypes', (list) => list.filter((t) => t.id !== id)),

  // Borrowers / Loans
  addBorrower: (b) => update('borrowers', (list) => [{ ...b, id: `BRW-${1000 + list.length + 1}` }, ...list]),
  updateBorrower: (id, patch) => update('borrowers', (list) => list.map((b) => (b.id === id ? { ...b, ...patch } : b))),
  removeBorrower: (id) => update('borrowers', (list) => list.filter((b) => b.id !== id)),

  // Penalty slabs
  addPenaltySlab: (p) => update('penaltySlabs', (list) => [...list, { ...p, id: `P-${list.length + 1}` }]),
  removePenaltySlab: (id) => update('penaltySlabs', (list) => list.filter((p) => p.id !== id)),

  // Collections (Kisht)
  addCollection: (c) => update('collections', (list) => [{ ...c, id: `KST-${5000 + list.length + 1}` }, ...list]),

  // Location logs
  addLocationLog: (l) => update('locationLogs', (list) => [{ ...l, id: `LOC-${String(list.length + 1).padStart(2, '0')}` }, ...list]),

  // Case close requests
  addCaseCloseRequest: (c) =>
    update('caseCloseRequests', (list) => [{ ...c, id: `CC-${String(list.length + 1).padStart(2, '0')}`, status: 'Pending' }, ...list]),
  updateCaseCloseRequest: (id, patch) =>
    update('caseCloseRequests', (list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c))),

  // Deposit requests
  addDepositRequest: (d) =>
    update('depositRequests', (list) => [{ ...d, id: `DEP-${String(list.length + 1).padStart(2, '0')}`, status: 'Pending' }, ...list]),
  updateDepositRequest: (id, patch) =>
    update('depositRequests', (list) => list.map((d) => (d.id === id ? { ...d, ...patch } : d))),

  // NOC records
  addNocRecord: (n) => update('nocRecords', (list) => [{ ...n, id: `NOC-${1000 + list.length + 1}` }, ...list]),
  updateNocRecord: (id, patch) => update('nocRecords', (list) => list.map((n) => (n.id === id ? { ...n, ...patch } : n))),
  removeNocRecord: (id) => update('nocRecords', (list) => list.filter((n) => n.id !== id)),

  // Full profile requests (worker: add + manage)
  addFullProfileRequest: (r) =>
    update('fullProfileRequests', (list) => [{ ...r, id: `FPR-${String(list.length + 1).padStart(2, '0')}`, status: 'Pending' }, ...list]),
  updateFullProfileRequest: (id, patch) =>
    update('fullProfileRequests', (list) => list.map((r) => (r.id === id ? { ...r, ...patch } : r))),
  removeFullProfileRequest: (id) => update('fullProfileRequests', (list) => list.filter((r) => r.id !== id)),

  // Invoices
  addInvoice: (i) => update('invoices', (list) => [{ ...i, id: `INV-${1000 + list.length + 1}` }, ...list]),

  // Backups
  addBackup: (b) => update('backups', (list) => [{ ...b, id: `BKP-${String(list.length + 1).padStart(2, '0')}` }, ...list]),
}

// Drop-in replacement for the old `useData()` hook that used to read from
// DataContext. Same shape: { store, ...actions }.
export function useData() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)
  return { store: snapshot, ...actions }
}

// Shared helper: a worker's wallet is derived, not stored - collected minus
// whatever has already been approved as deposited to the office.
export function getWallet(store, workerName) {
  const collected = store.collections.filter((c) => c.collectedBy === workerName).reduce((s, c) => s + Number(c.amount), 0)
  const deposited = store.depositRequests
    .filter((d) => d.worker === workerName && d.status === 'Approved')
    .reduce((s, d) => s + Number(d.amount), 0)
  const pending = store.depositRequests
    .filter((d) => d.worker === workerName && d.status === 'Pending')
    .reduce((s, d) => s + Number(d.amount), 0)
  return { collected, deposited, pending, balance: Math.max(0, collected - deposited) }
}

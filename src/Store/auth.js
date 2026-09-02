import { useSyncExternalStore } from 'react'

// Plain singleton store - no React Context involved anywhere. Any component
// can import { useAuth } and read/write the same shared state. Persistence
// to sessionStorage happens on every change.

const KEY = 'lf_auth_user'

function readInitial() {
  const raw = sessionStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : null
}

let state = readInitial()
const listeners = new Set()

function emit() {
  listeners.forEach((fn) => fn())
}

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function getSnapshot() {
  return state
}

const DEFAULT_NAMES = {
  admin: 'Mohit Sharma',
  subadmin: 'Gaurav Bansal',
}

function login(role, name) {
  state = { role, name: name || DEFAULT_NAMES[role] || 'User' }
  sessionStorage.setItem(KEY, JSON.stringify(state))
  emit()
}

function logout() {
  state = null
  sessionStorage.removeItem(KEY)
  emit()
}

// Drop-in replacement for the old `useAuth()` hook that used to read from
// AuthContext. Same shape: { user, login, logout }.
export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot)
  return { user, login, logout }
}

export { DEFAULT_NAMES }
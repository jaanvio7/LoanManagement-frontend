import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './Store/auth.js'

import Login from './Authentication/Login.jsx'

import AdminMaster from './Layout/Admin/AdminMaster.jsx'
import AdminDashboard from './Admin/Dashboard.jsx'
import SubadminManagement from './Admin/SubadminManagement.jsx'
import ViewWorkers from './Admin/ViewWorkers.jsx'
import ViewLoans from './Admin/ViewLoans.jsx'

import SubadminMaster from './Layout/Subadmin/SubadminMaster.jsx'
import SubadminDashboard from './Subadmin/Dashboard.jsx'
import ManageLoans from './Subadmin/ManageLoans.jsx'
import PenaltyManage from './Subadmin/PenaltyManage.jsx'
import BorrowerProfiles from './Subadmin/BorrowerProfiles.jsx'
import BorrowerDetail from './Subadmin/BorrowerDetail.jsx'

import NocManage from './Subadmin/NocManage.jsx'
import CaseCloseRequests from './Subadmin/CaseCloseRequests.jsx'
import DepositRequests from './Subadmin/DepositRequests.jsx'
import ProfitReport from './Subadmin/ProfitReport.jsx'
import DefaulterReport from './Subadmin/DefaulterReport.jsx'
import { ToastContainer } from 'react-toastify'
import RolePermission from './Admin/RolePermission.jsx'
import WorkerManagement from './Admin/WorkerManagement.jsx'
import SubAdminWorkerManagement from './Subadmin/SubAdminWorkerManagement.jsx'
import LoanTypeManagement from './Subadmin/LoanTypeManagement.jsx'
// Guards a whole section (admin / subadmin) rather than each page - the
// Master for that role is the only thing wrapped, so individual pages
// don't need to know about roles at all.
const HOME_FOR = { admin: '/admin', subadmin: '/subadmin' }

function RequireRole({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={HOME_FOR[user.role] || '/login'} replace />
  return children
}

export default function App() {
  const { user } = useAuth()

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to={user ? HOME_FOR[user.role] || '/login' : '/login'} replace />} />
      <Route path="/login" element={<Login />} />

      {/* Admin panel - one guarded parent route, Master renders the shell via <Outlet /> */}
      <Route path="/admin" element={<RequireRole role="admin"><AdminMaster /></RequireRole>}>
        <Route index element={<AdminDashboard />} />
        <Route path="subadmins" element={<SubadminManagement />} />
        <Route path="role" element={<RolePermission />} />
         <Route path="worker" element={<WorkerManagement />} />
        <Route path="workers" element={<ViewWorkers />} />
        <Route path="loans" element={<ViewLoans />} />
      </Route>

      {/* Subadmin panel */}
      <Route path="/subadmin" element={<RequireRole role="subadmin"><SubadminMaster /></RequireRole>}>
        <Route index element={<SubadminDashboard />} />
        <Route path="loans" element={<ManageLoans />} />
        <Route path="penalty" element={<PenaltyManage />} />
        <Route path="borrowers" element={<BorrowerProfiles />} />
         <Route path="subadmin-worker" element={<SubAdminWorkerManagement />} />
        <Route path="borrowers/:id" element={<BorrowerDetail />} />
        <Route path="loantype" element={<LoanTypeManagement />} />
      
        <Route path="noc" element={<NocManage />} />
        <Route path="case-close" element={<CaseCloseRequests />} />
        <Route path="deposits" element={<DepositRequests />} />
        <Route path="reports/profit" element={<ProfitReport />} />
        <Route path="reports/defaulters" element={<DefaulterReport />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <ToastContainer />
</>
  )
}

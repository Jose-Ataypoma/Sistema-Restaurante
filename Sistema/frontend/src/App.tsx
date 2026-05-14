import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@pages/Dashboard'
import TablesPage from '@pages/TablesPage'
import POSPage from '@pages/POSPage'
import KitchenPage from '@pages/KitchenPage'
import SUNATPage from '@pages/SUNATPage'
import CashPage from '@pages/CashPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mesas" element={<TablesPage />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="/cocina" element={<KitchenPage />} />
        <Route path="/sunat" element={<SUNATPage />} />
        <Route path="/caja" element={<CashPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

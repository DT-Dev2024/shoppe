import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/routes/ProtectedRoute'
import NotFound from '@/components/NotFound'
import Home from '@/pages/Home'
import { UserCheck } from 'lucide-react'
import { ProductPage } from './pages/ProductPage'
import { DataTableDemo } from './pages/TableTest'

export default function App() {
  return (
    <React.Suspense >
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />}>
            <Route path={'/'} element={<Home />} />
          </Route>
        </Route>
        <Route path='/products' element={<ProductPage />} />
        <Route path='/user' element={<UserCheck />} />
        <Route path='/demo' element={<DataTableDemo />} />
        <Route path={'*'} element={<NotFound />}></Route>
      </Routes>
    </React.Suspense>
  )
}

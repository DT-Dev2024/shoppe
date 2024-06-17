import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import { Home, NotFound } from './routes/routes'
import Loading from '@components/Loading'

export default function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={'/'} element={<Home />} />
          </Route>
        </Route>
        <Route path={'*'} element={<NotFound />}></Route>
      </Routes>
    </React.Suspense>
  )
}

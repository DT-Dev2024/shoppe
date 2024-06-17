import Header from '@components/Header'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="container max-w-screen-xl mx-auto flex gap-32 mt-10 px-4">
        <Outlet />
      </div>
    </>
  )
}

export default MainLayout

import { BiCart } from 'react-icons/bi'
import { CiCircleQuestion } from 'react-icons/ci'
import { FaFacebook, FaInstagram, FaSearch } from 'react-icons/fa'
import { IoIosNotificationsOutline } from 'react-icons/io'
import Logo from './Logo'
const Header = () => {
  return (
    <header className="w-full px-[21rem] pt-2 bg-gradient-to-b from-[#f53d2d] to-[#f63] text-white">
      <div className="h-fit flex justify-between text-sm">
        <div className="flex space-x-2">
          <span>Kênh bán hàng |</span>
          <span>Tải ứng dụng |</span>
          <span className="flex items-center space-x-1">
            <span>Kết nối</span>
            <FaFacebook />
            <FaInstagram />
          </span>
        </div>
        <div className="flex  space-x-2">
          <span className="flex items-center">
            <IoIosNotificationsOutline className="text-xl" />
            Thông báo
          </span>
          <span className="flex items-center">
            <CiCircleQuestion className="text-2xl" />
            Hỗ trợ
          </span>
        </div>
      </div>
      <div className="flex pt-6 items-start space-x-10">
        <Logo />
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full border-none rounded p-2 "
            placeholder="search"
          />
          <span className="absolute right-1 top-[8%] py-2 px-4 shadow rounded text-white bg-main">
            <FaSearch />
          </span>

          <ul className="flex space-x-2 pt-1 text-xs">
            <li>Nước Hoa Nữ</li>
            <li>Bàn Làm Việc Gấp Gọn</li>
            <li>Decor PC</li>
            <li>Tester68</li>
            <li>Gấu Bông Capybara</li>
            <li>Kit Bàn Phím Cơ 75%</li>
            <li>Đồng Hồ Nam</li>
          </ul>
        </div>
        <span className="p-4 text-4xl">
          <BiCart />
        </span>
      </div>
    </header>
  )
}

export default Header

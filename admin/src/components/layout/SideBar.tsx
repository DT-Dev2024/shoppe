import { AreaChart, BadgeDollarSign, User } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import MenuItem from './MenuItem';

const SideBar = () => {
  return (
    <>
      <div className='h-[90vh] w-[15vw] border-r-2'>
        <ul>
          <MenuItem title={'Khách hàng'} icon={User} link={'user'} />
          <MenuItem title={'Sản phẩm'} icon={ShoppingCart} link={'products'} />
          <MenuItem title={'Thống kê'} icon={AreaChart} link={''} />
          <MenuItem
            title={'Chương trình khuyến mãi'}
            icon={BadgeDollarSign}
            link={''}
          />
        </ul>
      </div>
    </>
  );
};

export default SideBar;

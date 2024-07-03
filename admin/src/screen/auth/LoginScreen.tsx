import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import R from '../../component/assets';
import { SESSION } from '../../config/constants';
import reactotron from '../../ReactotronConfig';
import { requestLogin } from '../../service/network/Api';
import { showToast } from '../../util/funcUtils';
import './LoginStyles.css';

export default function LoginScreen() {
  // const [isLoading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  // const updateAccountData = useStore((state) => state.upadteAccountData);

  const handleOnSubmit = async (values: any) => {
    const { username, password } = values;
    const payload = {
      phone: username,
      password: password,
    };
    try {
      const res = await requestLogin(payload);
      console.log(res);
      if (res?.code !== 401) {
        Cookies.set(SESSION, res.data.access_token);
        // const userInfo = await requestGetProfile();
        reactotron.logImportant!('userInfo', res);
        Cookies.set('userId', res.data.user.id);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        showToast('Đăng nhập thành công');
        navigate('/');
      }
    } catch (error) {
      reactotron.logImportant!('error', error);
    }

    // let loginData: any = await firebaseServices.requestLogin({
    //   username,
    //   password,
    // });

    // if (!loginData.status)
    //   return showToast(
    //     'Tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại',
    //     'error'
    //   );

    // delete loginData.data[password];

    // showToast('Đăng nhập thành công');
    // updateAccountData(loginData.data);
    // navigate('/');
  };
  // const onFinish = () => {};
  return (
    <div className='login' style={{ backgroundColor: '#1b2886' }}>
      {/* <div className="login_image">
        <img
          src={R.images.img_background}
          alt="logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(1px)",
            backgroundColor: "white",
          }}
        />
      </div> */}
      {/* <div
        className="login_image"
        style={{ backgroundColor: "black", opacity: 0.5 }}
      ></div> */}
      <div className='container_login'>
        <img
          alt=''
          src={R.images.img_logo}
          style={{
            width: '60%',
            height: 'auto',
            // marginTop: "10px",
            marginBottom: '30px',
          }}
        />
        <Form
          form={form}
          name='normal_login'
          className='login-form'
          initialValues={{ remember: true, username: null, password: null }}
          onFinish={handleOnSubmit}
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder={'Tên tài khoản'}
            />
          </Form.Item>
          <Form.Item
            style={{ marginTop: 10 }}
            name='password'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              {
                max: 55,
                min: 6,
                message: 'Độ dài mật khẩu từ 6 đến 55 ký tự',
              },
              {
                whitespace: true,
                message: 'Không được phép nhập khoảng trắng',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder={R.strings().password}
            />
          </Form.Item>
          <Form.Item
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            <Button
              type='primary'
              htmlType='submit'
              style={{ borderRadius: '5px' }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Outlet />
    </div>
  );
}

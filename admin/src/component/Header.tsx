import {
  Layout,
  Dropdown,
  Menu,
  message,
  Row,
  Form,
  Button,
  Typography,
  Popconfirm,
} from 'antd';
import R from './assets';
import Icon from './icon/Icon';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ModalForm from './ModalForm';
import { useEffect, useState } from 'react';
import { FORM_ITEM_LAYOUT_STAFF, SESSION } from '../config/constants';
import { useStore } from '../store';
import firebaseServices from '../service/firebaseServices';
import { showToast } from '../util/funcUtils';
import {
  requestChangePassword,
  requestResetPassword,
} from '../service/network/Api';
import reactotron from '../ReactotronConfig';
import { FormItem } from './FormItem';
import Cookies from 'js-cookie';

const { Header } = Layout;

const ACTION = {
  CHANGE_PASSWORD: 1,
  RESET_PASSWORD: 2,
  LOGOUT: 3,
};

export const HeaderComponent = ({ toggle }: { toggle: any }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useStore((state) => state.user);

  const [visile, setVisible] = useState<any>();
  const [useInfo, setUserInfo] = useState<any>();

  const onSubmitChangePwd = async (values: any) => {
    const { oldPwd, newPwd, password } = values;

    const payload = {
      old_password: oldPwd,
      new_password: newPwd,
    };
    try {
      const res = await requestChangePassword(payload);
      if (res?.code != 400) {
        setVisible(0);
        showToast('Cập nhật mật khẩu thành công!');
      }
    } catch (error) {
      showToast('Đã có lỗi xảy ra! Vui lòng thử lại.');
    }
  };
  const getUserInfo = async () => {
    try {
      // const res = await requestGetProfile();
      // if (res) {
      // reactotron.logImportant!(res);
      setUserInfo('');
      // }
    } catch (error) {}
  };

  const handleResetPassword = async () => {
    const payload = {
      id: useInfo._id,
      body: {
        password: '123456',
      },
    };
    try {
      const res = await requestResetPassword(payload);
      if (res) {
        setVisible(0);
        showToast('Đặt lại mật khẩu thành công!');
      }
    } catch (error) {
      showToast('Đã có lỗi xảy ra! Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const onClick = ({ key }: { key: any }) => {
    if (key == ACTION.CHANGE_PASSWORD) {
      setVisible(1);
      return;
    }
    if (key == ACTION.RESET_PASSWORD) {
      setVisible(2);
      return;
    }
    if (key == ACTION.LOGOUT) {
      Cookies.set(SESSION, '');
      navigate('/login');
      return;
    }
  };

  const menu = (
    <Menu onClick={onClick} style={{ paddingTop: 0, marginTop: 10 }}>
      <Menu.Item
        key={ACTION.CHANGE_PASSWORD}
        icon={<IconDropdown src={R.images.img_change_password} />}
        children={'Đổi mật khẩu'}
      />
      <Menu.Item
        key={ACTION.RESET_PASSWORD}
        icon={<IconDropdown src={R.images.img_reset_password} />}
        children={'Đặt lại khẩu'}
      />
      <Menu.Item
        key={ACTION.LOGOUT}
        icon={<IconDropdown src={R.images.img_logout} />}
        children={'Đăng xuất'}
      />
    </Menu>
  );

  return (
    <Header
      style={{
        height: 50,
        padding: 0,
        background: 'white',
      }}
    >
      <Row style={{ paddingRight: 10 }} justify='space-between'>
        <Typography.Title
          children='Quản trị viên'
          style={{
            margin: 0,
            fontSize: '20px',
            marginTop: 8,
            paddingLeft: 10,
            paddingTop: 8,
          }}
        />
        <Dropdown overlay={menu} overlayStyle={{}}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              paddingBottom: 10,
              height: '4vh',
              marginTop: -5,
            }}
          >
            {useInfo ? useInfo?.identifier + '  ' : ''}{' '}
            <IconDropdown src={R.images.img_user_header} />
          </a>
        </Dropdown>
      </Row>
      <ModalForm
        visible={visile == 1 || visile == 2}
        title={visile == 1 ? 'Đổi mật khẩu' : 'Đặt lại mật khẩu'}
        onCancel={() => {
          setVisible(0);
        }}
        children={
          <>
            {visile == 1 && (
              <Form
                {...FORM_ITEM_LAYOUT_STAFF}
                form={form}
                name='register'
                labelAlign='left'
                onFinish={onSubmitChangePwd}
                initialValues={{}}
                scrollToFirstError
                children={
                  <>
                    <FormItem
                      label={'Mật khẩu cũ'}
                      type={'password'}
                      name='oldPwd'
                    />
                    <FormItem
                      label={'Mật khẩu mới'}
                      type={'password'}
                      name='newPwd'
                    />
                    <FormItem
                      label={'Xác nhận mật khẩu'}
                      name='verify'
                      type={'password'}
                    />
                    <Row justify='end'>
                      <Button
                        style={{
                          fontWeight: 800,
                          borderRadius: '3px',
                          marginRight: 10,
                        }}
                        danger
                        type='primary'
                        children={'Huỷ'}
                        onClick={() => setVisible(0)}
                      />
                      <Form.Item>
                        <Button
                          style={{
                            fontWeight: 800,
                            borderRadius: '3px',
                          }}
                          type='primary'
                          htmlType='submit'
                          children={'Xác nhận'}
                        />
                      </Form.Item>
                    </Row>
                  </>
                }
              />
            )}
            {visile == 2 && (
              <div>
                <Row>
                  Mật khẩu của bạn sẽ được đặt về mặc định là:
                  <h4 style={{ color: 'red' }} children={' 123456'} />
                </Row>
                <Button
                  onClick={handleResetPassword}
                  style={{
                    fontWeight: 800,
                    borderRadius: '3px',
                    marginTop: 10,
                  }}
                  type='primary'
                  htmlType='submit'
                  children={'Đặt lại'}
                />
              </div>
            )}
          </>
        }
      />
    </Header>
  );
};

const OptionTopComponent: React.FC<{ onToggle: () => any }> = () => {
  return (
    <div className={'option-top-component'}>
      <div onClick={() => {}}>{Icon.COLLAPSED_MENU}</div>
      <div className={'wrapper-icon-header'}></div>
    </div>
  );
};

const IconDropdown = ({ src }: { src: any }) => {
  return (
    <img
      src={src}
      style={{
        width: 24,
        height: 24,
        marginRight: 8,
        marginLeft: 10,
      }}
    />
  );
};

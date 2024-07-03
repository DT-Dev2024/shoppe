/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DisconnectOutlined,
  DollarOutlined,
  EditOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  PageHeader,
  Row,
  Select,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import { createSearchParams, Outlet, useNavigate } from 'react-router-dom';
import { COLUMNS_CUSTOMER } from '../../config/constants';
import { ADMIN_ROUTER_PATH } from '../../config/router';
import reactotron from '../../ReactotronConfig';
import {
  requestGetListCustomer,
  requestGetTransaction,
  requestUpdateInfoCus,
} from '../../service/network/Api';
import DateUtil from '../../util/DateUtil';
import { formatPrice, showToast } from '../../util/funcUtils';
import { Header } from '../dashboard/component/Header';
import ButtonBottomModal from '../product/component/ButtonBottomModal';

const { Option } = Select;
// name: '',
// phone: '',
// email: '',
interface ICustomerUpdate {
  name: string;
  phone: string;
  email: string;
}
const CustomerScreen = () => {
  const [loading, setLoading] = useState(false);
  const [listCustomer, setListCustomer] = useState<any>([]);
  const [visible, setVisible] = useState<any>({
    type: 0,
    show: false,
  });
  const [idCustomer, setIdCustomer] = useState<any>();
  const [item, setItem] = useState<any>();
  const [input, setInput] = useState<any>();
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const LIMIT = 12;
  const navigate = useNavigate();
  const [search, setSearch] = useState<any>(undefined);

  const [infoCus, setInfoCusr] = useState<ICustomerUpdate>({
    name: '',
    phone: '',
    email: '',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userIds, setUserIds] = useState<any>([]);
  const getData = async (vip?: any) => {
    setLoading(true);

    try {
      const res = await requestGetListCustomer();
      if (res) {
        setLoading(false);
        let data = res.data;
        // data.map((item: any) => {
        //   if (item?.level) {
        //     vip.map((vipItem: any) => {
        //       if (item?.level === vipItem.key) {
        //         item.levelName = vipItem.name;
        //         return;
        //       }
        //     });
        //     return;
        //   }
        //   item.levelName = vip[0].name;
        // });
        reactotron.logImportant!('DATA', data);

        // setTimeout(() => {
        setListCustomer(data);
        setTotalPage(res.meta.pagination.total);
        // }, 500);
      }
    } catch (error) {}
  };

  const handeUpdateInfo = async () => {
    let payload = {
      name: infoCus?.name || null,
      phone: infoCus?.phone || null,
      email: infoCus?.email || null,
      id: idCustomer,
    };

    try {
      const res = await requestUpdateInfoCus(payload);
      if (res?.code !== 404 && res?.statusCode !== 500) {
        setVisible({
          ...visible,
          type: 0,
          show: false,
        });
        showToast('Cập nhật thông tin khách hàng thành công!');
        setInfoCusr({
          name: '',
          phone: '',
          email: '',
        });
        getData();
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra! Vui lòng thử lại.');
    }
  };

  const handleDeleteListUser = async () => {
    console.log('userIds: ', userIds);
    // try {
    //   const res = await requestDeleteListUser({ user_ids: userIds });
    //   if (res) {
    //     showToast('Xoá khách hàng thành công!');
    //     getData();
    //     setUserIds([]);
    //     setSelectedRowKeys([]);
    //   }
    // } catch (error) {
    //   showToast('Đã có lỗi xảy ra! Vui lòng thử lại.');
    // }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    let user_ids: any = [];
    newSelectedRowKeys.map((el: any) => {
      return user_ids.push(listCustomer[+el]?.id);
    });
    console.log('user_ids: ', user_ids);
    setUserIds(user_ids);

    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    let timeout: any;
    if (search !== undefined) {
      timeout = setTimeout(() => {
        getData();
      }, 250);
      return;
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const renderUpdateUserInfo = () => {
    return (
      <div>
        <div>
          <label>{'Tên khách hàng'}</label>
          <Input
            value={infoCus.name}
            style={{ marginTop: 10 }}
            placeholder={'Nhập tên khách hàng'}
            onChange={(e) => {
              setInfoCusr({
                ...infoCus,
                name: e.target.value,
              });
            }}
          />
        </div>

        <div>
          <label>{'Số điện thoại'}</label>
          <Input
            value={infoCus.phone}
            style={{ marginTop: 10 }}
            placeholder={'Nhập số điện thoại khách hàng'}
            onChange={(e) => {
              setInfoCusr({
                ...infoCus,
                phone: e.target.value,
              });
            }}
          />
        </div>

        <div>
          <label>{'Email'}</label>
          <Input
            value={infoCus.email}
            style={{ marginTop: 10 }}
            placeholder={'Nhập email khách hàng'}
            onChange={(e) => {
              setInfoCusr({
                ...infoCus,
                email: e.target.value,
              });
            }}
          />
        </div>
      </div>
    );
  };

  const [transactionData, setTransactionData] = useState<any>({});
  const [expandedRow, setExpandedRow] = useState(null);
  const handleRowExpand = async (record: any) => {
    const res = await requestGetTransaction(record.id);
    const data = Object.values(res.data);
    setTransactionData({ ...transactionData, [record.id]: data });
    setExpandedRow(record.id);
  };
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title='Khách hàng'
        style={{ backgroundColor: 'white', margin: '5px 10px 10px' }}
        extra={[
          <Header
            placeholderSearch={'Nhập tên hoặc số điện thoại'}
            onSearchSubmit={(input: any) => {
              setSearch(input);
            }}
            onStatusSubmit={(statusKey: string) => {}}
            placeholderDrop={'Sắp xếp'}
            dataDropdown={[]}
            showButton={!!selectedRowKeys?.length}
            title={'Xoá'}
            onClick={handleDeleteListUser}
          />,
        ]}
      />
      <div
        style={{
          backgroundColor: 'white',
          margin: '0px 10px 0px',
          padding: '15px 20px',
        }}
      >
        <Table
          style={{ height: '90vh' }}
          loading={loading}
          dataSource={listCustomer}
          bordered
          rowKey={(_, index) => `${index}`}
          columns={COLUMNS_CUSTOMER}
          rowSelection={rowSelection}
          expandRowByClick={true}
          pagination={{
            pageSize: LIMIT,
            total: totalPage,
            onChange: (page) => {
              setPage(page);
            },
          }}
          expandable={{
            expandedRowRender: (item: any) => {
              const data = transactionData[item.id];
              const totalOrder = data?.length;
              const totalMoney = data?.reduce((acc: any, item: any) => {
                return acc + item.price;
              }, 0);
              if (!data) {
                return <div>Loading...</div>;
              }

              return (
                <div style={{ backgroundColor: 'white' }}>
                  <Card
                    style={{
                      width: '100%',
                      backgroundColor: '#f6f9ff',
                      borderColor: '#1890ff',
                      borderTop: 'none',
                    }}
                    actions={[
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <Col>
                          <Button
                            type='text'
                            size='large'
                            icon={<DollarOutlined />}
                            style={{
                              color: 'tomato',
                            }}
                          >
                            Số tiền đã mua
                            <span>: ₫{formatPrice(totalMoney)}</span>
                          </Button>
                          <Button
                            onClick={() => {
                              setIdCustomer(item.id);
                              setItem(item);
                              setVisible({
                                ...visible,
                                type: 5,
                                show: true,
                              });
                              setInput('');
                            }}
                            type='text'
                            size='large'
                            icon={<ShoppingCartOutlined />}
                            style={{
                              color: 'ThreeDShadow',
                            }}
                          >
                            Số đơn hàng đã mua
                            <span>: {totalOrder}</span>
                          </Button>
                          <Button
                            onClick={() => {
                              navigate({
                                pathname: `${ADMIN_ROUTER_PATH.CUSTOMER_TRANSACTION}`,
                                search: createSearchParams({
                                  userId: item.id,
                                }).toString(),
                              });
                            }}
                            type='text'
                            size='large'
                            icon={<DisconnectOutlined />}
                            style={{
                              color: 'ThreeDShadow',
                            }}
                          >
                            Lịch sử dơn hàng
                          </Button>
                        </Col>
                      </div>,
                    ]}
                  >
                    <div>
                      <Row style={{ alignItems: 'center' }}>
                        <h3
                          style={{
                            color: '#007aff',
                            flex: 1,
                          }}
                          children={'Cập nhật thông tin tài khoản'}
                        />
                        <Button
                          onClick={() => {
                            setVisible({
                              ...visible,
                              type: 11,
                              show: true,
                            });
                            setInput('');
                            setIdCustomer(item.id);
                            setItem(item);
                            setInfoCusr({
                              name: item?.name,
                              phone: item?.phone,
                              email: item?.email,
                            });
                          }}
                          type='text'
                          size='large'
                          icon={<EditOutlined />}
                          style={{
                            color: 'blueviolet',
                          }}
                        />
                      </Row>
                      <Row style={{ marginTop: 20 }}>
                        <Col flex={1}>
                          <h4>Mã khách hàng: {item.id}</h4>
                          <h4>Số điện thoại: {item.phone}</h4>
                        </Col>
                        <Col flex={1}>
                          <h4>Tên khách hàng: {item.name}</h4>
                          <h4>
                            Ngày tạo:
                            {DateUtil.formatTimeDateReview(item.created_at)}
                          </h4>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </div>
              );
            },
            onExpand: (expanded, record) => {
              if (expanded) {
                handleRowExpand(record);
              }
            },
          }}
        />
        <Modal
          onCancel={() => {
            setVisible({
              ...visible,
              type: 0,
              show: false,
            });
            setIdCustomer(undefined);
            setItem(undefined);
          }}
          maskClosable={false}
          footer={null}
          title={visible.type === 11 && 'Cập nhật thông tin khách hàng'}
          visible={visible.show}
        >
          {(visible.type === 11 && renderUpdateUserInfo()) || null}

          <ButtonBottomModal
            isLoadingButton={false}
            onCancel={() => {
              setVisible({
                ...visible,
                type: 0,
                show: false,
              });
              setIdCustomer(undefined);
              setItem(undefined);
              setInput('');
            }}
            onClickconfirm={() => {
              if (visible.type === 11) {
                handeUpdateInfo();
                return;
              }
            }}
            text={'Xác nhận'}
          />
        </Modal>
      </div>
      <Outlet />
    </div>
  );
};

export default CustomerScreen;

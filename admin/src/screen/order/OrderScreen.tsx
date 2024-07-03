import { Card, PageHeader, Table, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkToken,
  COLUMNS_TRANSACTION,
  getUserId,
} from '../../config/constants';
import reactotron from '../../ReactotronConfig';
import {
  requestAllOrder,
  requestGetTransaction,
  updateStatusOrder,
} from '../../service/network/Api';
import { showToast } from '../../util/funcUtils';
import { Header } from '../dashboard/component/Header';
import { toast } from 'react-toastify';
const { TabPane } = Tabs;

enum Status {
  ALL = 'Tất cả',
  WAITING = 'Chờ thanh toán',
  DELIVERING = 'Vận chuyển',
  WAIT_RECEIVED = 'Chờ giao hàng',
  DELIVERED = 'Hoàn thành',
  CANCELED = 'Đã hủy',
  RETURN = 'Trả hàng/Hoàn tiền',
}
const OrderScreen = () => {
  const [tabs, setTabs] = useState(1);
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);

  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const [listTransaction, setListTransaction] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async (userId: string) => {
    setIsLoading(true);

    try {
      // const res = await requestGetTransaction(userId || '');
      const res = await requestAllOrder();
      if (res) {
        setIsLoading(false);
        reactotron.logImportant!('getData', res);
        const data = Object.values(res.data);
        setListTransaction(data as unknown as []);
      }
    } catch (error) {
      showToast('Đã có lỗi xảy ra! Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    checkToken().then((res) => {
      if (res) return;
      navigate('/login');
      showToast('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
    });

    getUserId().then((res) => {
      console.log('res', res);
      setUserId(res || '');
      if (res) getData(res);
    });
  }, []);
  const [transactionData, setTransactionData] = useState<any>({});
  const [expandedRow, setExpandedRow] = useState(null);
  const handleChangeStatus = (newStatus: string, id: string) => {
    // Update the status in the transactionData state
    setTransactionData((prevData: any) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        status: newStatus,
      },
    }));
  };
  const handleRowExpand = async (record: any) => {
    setTransactionData({
      ...transactionData,
      [record.id]: {
        ...record,
        status: record.status,
      },
    });
    setExpandedRow(record.id);
  };
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        onBack={() => {
          navigate(-1);
        }}
        title='Đơn hàng'
        style={{ backgroundColor: 'white', margin: '5px 10px 10px' }}
        extra={[<Header />]}
      />
      <div
        style={{
          backgroundColor: 'white',
          margin: '0px 10px 0px',
          padding: '15px 20px',
        }}
      >
        <Table
          dataSource={listTransaction}
          loading={isLoading}
          bordered
          rowKey={(_, index) => `${index}`}
          columns={COLUMNS_TRANSACTION}
          expandRowByClick={true}
          expandable={{
            expandedRowRender: (record) => {
              const data = transactionData[record.id];

              const localStatus = data.status;
              const updateStatus = async () => {
                const dataUpdate = {
                  id: data.id,
                  status: data.status,
                };

                //udpate status of listTransaction
                const rs = await updateStatusOrder(dataUpdate);
                if (rs.status === 200) {
                  const newListTransaction = listTransaction.map(
                    (item: any) => {
                      if (item.id === data.id) {
                        return {
                          ...item,
                          status: data.status,
                        };
                      }
                      return item;
                    },
                  );
                  toast.success('Cập nhật trạng thái thành công');
                  setListTransaction(newListTransaction);
                  setExpandedRow(null);
                } else {
                  toast.error('Cập nhật trạng thái thất bại');
                }
              };

              return (
                <Card
                  title='Thay đổi trạng thái'
                  style={{ width: '100%' }}
                  actions={[
                    <button
                      onClick={updateStatus}
                      style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginLeft: '2rem',
                      }}
                    >
                      Lưu
                    </button>,
                  ]}
                >
                  {Object.keys(Status).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleChangeStatus(key, record.id)}
                      style={{
                        padding: '10px 20px',
                        display: 'inline-block',
                        cursor: 'pointer',
                        backgroundColor:
                          localStatus === key ? 'lightgray' : 'white',
                      }}
                    >
                      {Status[key as keyof typeof Status]}
                    </button>
                  ))}
                </Card>
              );
            },
            onExpand: (expanded, record) => {
              if (expanded) {
                handleRowExpand(record);
              }
            },
          }}
        />
      </div>
    </div>
  );
};

export default OrderScreen;

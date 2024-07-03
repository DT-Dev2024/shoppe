import { Card, Col, PageHeader, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { COLUMNS_TRANSACTION } from '../../config/constants';
import reactotron from '../../ReactotronConfig';
import {
  requestGetTransaction,
  updateStatusOrder,
} from '../../service/network/Api';
import { showToast } from '../../util/funcUtils';
import { Header } from '../dashboard/component/Header';
import { toast } from 'react-toastify';
import DateUtil from '../../util/DateUtil';
enum Status {
  ALL = 'Tất cả',
  WAITING = 'Chờ thanh toán',
  DELIVERING = 'Vận chuyển',
  WAIT_RECEIVED = 'Chờ giao hàng',
  DELIVERED = 'Hoàn thành',
  CANCELED = 'Đã hủy',
  RETURN = 'Trả hàng/Hoàn tiền',
}
const TransactionCustomerScreen = (props: any) => {
  const [searchparams] = useSearchParams();
  const userId = searchparams.get('userId');
  const navigate = useNavigate();
  const [listTransaction, setListTransaction] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);

    try {
      const res = await requestGetTransaction(userId || '');
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
    getData();
  }, [userId]);

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
        title='Lịch sử giao dịch'
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
              const { address } = record;
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
                  title='Thông tin đơn hàng'
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
                  <div>
                    <Row style={{ marginTop: 20 }}>
                      <Col flex={1}>
                        <h4>Mã khách hàng: {address.usersId} </h4>
                        <h4>Số điện thoại: {address.phone}</h4>
                      </Col>

                      <Col flex={1}>
                        <h4>Tên khách hàng: {address.name}</h4>
                        <h4>
                          Ngày mua:{' '}
                          {DateUtil.formatTimeDateReview(address.created_at)}
                        </h4>
                      </Col>
                    </Row>
                  </div>
                  <Row style={{ alignItems: 'center' }}>
                    <h4>Địa chỉ: {address.address} </h4>
                  </Row>
                  <Row style={{ alignItems: 'center', marginTop: '1rem' }}>
                    <h3
                      style={{
                        color: '#007aff',
                        flex: 1,
                      }}
                      children={'Cập nhật trạng thái của đơn hàng'}
                    />
                  </Row>
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

export default TransactionCustomerScreen;

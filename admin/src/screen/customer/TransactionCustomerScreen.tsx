import { PageHeader, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { COLUMNS_TRANSACTION } from '../../config/constants';
import reactotron from '../../ReactotronConfig';
import { requestGetTransaction } from '../../service/network/Api';
import { showToast } from '../../util/funcUtils';
import { Header } from '../dashboard/component/Header';

const TransactionCustomerScreen = (props: any) => {
  const [searchparams] = useSearchParams();
  const userId = searchparams.get('userId');
  const navigate = useNavigate();
  const [listTransaction, setListTransaction] = useState([]);
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
        />
      </div>
    </div>
  );
};

export default TransactionCustomerScreen;

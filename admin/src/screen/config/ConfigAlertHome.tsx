import React from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Input,
  message,
  Row,
  Select,
  Spin,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';
import { ApiClient } from '../../service/ApiService';
import { showToast } from '../../util/funcUtils';

function ConfigAlertHome() {
  const [state, setState] = useState<any>({
    top: '',
    content: '',
    bottom: '',
  });

  const handleUpdate = async () => {
    await ApiClient.put(`api/v1/content/update/popup`, state);

    showToast("Cập nhật thành công")
  };

  const getData = async () => {
    const data = (await ApiClient.get(`api/v1/content/detail/popup`)).data;
    setState(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ height: '80vh' }}>
      <h2>Thông tin</h2>
      <div style={{ width: 600 }}>
        <Col style={{ marginTop: 15 }}>
          <label
            style={{ fontWeight: 'bolder', color: 'GrayText' }}
            children={'Tiêu đề'}
          />
          <Input
            value={state.top || undefined}
            style={{ width: '100%', marginTop: 8 }}
            placeholder="Nhập tiêu đề"
            onChange={(input) => {
              setState({
                ...state,
                top: input.target.value,
              });
            }}
          />
        </Col>
        <Col style={{ marginTop: 15 }}>
          <label
            style={{ fontWeight: 'bolder', color: 'GrayText' }}
            children={'Nội dung'}
          />
          <Input.TextArea
            value={state.content || undefined}
            style={{ width: '100%', height: 200, marginTop: 8 }}
            placeholder="Nhập nội dung"
            onChange={(input) => {
              setState({
                ...state,
                content: input.target.value,
              });
            }}
          />
        </Col>
        <Col style={{ marginTop: 15 }}>
          <label
            style={{ fontWeight: 'bolder', color: 'GrayText' }}
            children={'Kết thúc'}
          />
          <Input
            value={state.bottom || undefined}
            style={{ width: '100%', marginTop: 8 }}
            placeholder="Nhập kết thúc"
            onChange={(input) => {
              setState({
                ...state,
                bottom: input.target.value,
              });
            }}
          />
        </Col>
        <Button
          onClick={handleUpdate}
          style={{
            marginTop: 25,
            fontWeight: 800,
            borderRadius: '3px',
            width: '100%',
            height: 40,
          }}
          type="primary"
          htmlType="submit"
          children={'Cập nhật'}
        />
      </div>
    </div>
  );
}

export default ConfigAlertHome;

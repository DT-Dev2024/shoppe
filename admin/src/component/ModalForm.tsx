import { Modal } from 'antd';
import React from 'react';

const ModalForm = (props: any) => {
  const { visible, onCancel, children, title } = props;
  return (
    <div>
      <Modal
        onCancel={onCancel}
        maskClosable={false}
        footer={null}
        title={title}
        visible={visible}
        children={children}
      />
    </div>
  );
};
export default ModalForm;

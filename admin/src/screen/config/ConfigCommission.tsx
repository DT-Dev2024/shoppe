import { Button, Input, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  requestCommissions,
  updateCommissions,
} from "../../service/network/Api";

export default function ConfigCommission() {
  const [dataSource, setDataSource] = useState<Array<any>>([]);
  const columns = [
    {
      title: "Cấp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hoa hồng nạp tiền",
      dataIndex: "value_commission_recharge",
      key: "value_commission_recharge",
      render: (value: any, record: any) => {
        return (
          <>
            <Input
              value={value}
              onChange={(e) => {
                if (Number(e.target.value))
                  onChangeInput(
                    record.key,
                    e.target.value,
                    "value_commission_recharge"
                  );
              }}
            />
          </>
        );
      },
    },
    {
      title: "Hoa hồng nhiệm vụ ",
      dataIndex: "value_commission_mission",
      key: "value_commission_mission",
      render: (value: any, record: any) => {
        return (
          <>
            <Input
              value={value}
              onChange={(e) => {
                if (Number(e.target.value))
                  onChangeInput(
                    record.key,
                    e.target.value,
                    "value_commission_mission"
                  );
              }}
            />
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "key",
      key: "key",
      render: (value: any, record: any) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                onSave(record);
              }}
            >
              Lưu
            </Button>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = async () => {
    try {
      const res = await requestCommissions();
      setDataSource(res.data);
    } catch (error) {
      console.error("Exception " + error);
    }
  };

  const onChangeInput = (key: string, value: any, type: string) => {
    const index = dataSource.findIndex((x) => x.key === key);
    const new_data = [...dataSource];

    new_data[index][type] = value;
    setDataSource(new_data);
  };

  const onSave = async (data: any) => {
    try {
      const res = await updateCommissions(data.key, {
        value_commission_recharge: parseInt(data.value_commission_recharge),
        value_commission_mission: parseInt(data.value_commission_mission),
      });
      if (res.data) message.success("Cập nhật thành công");
      console.log("res: ", res);
    } catch (error) {
      console.error("Exception " + error);
    }
  };

  return (
    <div style={{ border: "1px solid #73d13d", borderRadius: "6px" }}>
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #73d13d",
          color: "#237804",
          backgroundColor: "#b7eb8f",
          borderRadius: "6px 6px 0px 0px",
          fontWeight: 500,
          fontSize: "18px",
        }}
      >
        Hoa hồng theo cấp
      </div>
      <div style={{ padding: "12px" }}>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
}

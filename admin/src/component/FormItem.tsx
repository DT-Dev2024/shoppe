import { Form, Input } from "antd";
import { LiteralUnion } from "antd/lib/_util/type";

export const FormItem = ({
  label,
  name,
  type,
  disable = false,
}: {
  label: string;
  name: string;
  type?: LiteralUnion<
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week",
    string
  >;
  disable?: boolean;
}) => (
  <Form.Item
    label={label}
    name={name}
    rules={[
      {
        required: true,
        message: `Vui lòng nhập ${label.toLowerCase()}`,
      },
      {
        whitespace: true,
        message: "Không được nhập khoảng trắng!",
      },
      {
        max: 55,
        message: "Vui lòng không nhập quá 55 ký tự!",
      },
    ]}
  >
    <Input
      disabled={disable}
      type={type}
      placeholder={`Nhập ${label.toLowerCase()}`}
    />
  </Form.Item>
);

import { Select } from 'antd'
import { OptionItem } from '../props'
import './Input.css'

const { Option } = Select
export interface PropsRadiusSelection {
  placeholder: string
  defaultValue?: number | string
  options: Array<OptionItem>
  onChange: (value: any) => void
  onFocus?: () => void
  onBlur?: () => void
  showSearch?: boolean
  onSearch?: (value: any) => void
  style?: any
  value?: number | string
  id?: string
  disabled?: boolean
}

export default function RadiusSelection({
  placeholder,
  defaultValue,
  options,
  onChange,
  onFocus,
  onBlur,
  showSearch,
  onSearch,
  style,
  value,
  id,
  disabled,
}: PropsRadiusSelection) {
  return (
    <Select
      id={id}
      className="radius-select"
      style={style ? style : { width: '100%', fontWeight: 'normal' }}
      allowClear
      placeholder={placeholder}
      defaultValue={defaultValue || undefined}
      optionFilterProp="children"
      showSearch={showSearch}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onSearch={onSearch}
      value={value}
      disabled={disabled}
    >
      {options?.map((item: OptionItem) => {
        return (
          <Option value={item.value} disabled={item.disabled}>
            {item.text}
          </Option>
        )
      })}
    </Select>
  )
}

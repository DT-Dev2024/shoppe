import { useState, useEffect, useRef } from "react";
import { Input } from "antd";
import Icon from "@ant-design/icons";
import styled from "styled-components";
const { Search } = Input;

const Container = styled.div`
  width: 100%;
  background-color: white;
`;
type TypingAutoSearchProps = {
  onSearchSubmit: (key: string) => void;
  isSearchLoading: boolean;
  placeholder?: string;
};

const TypingAutoSearch = ({
  onSearchSubmit,
  isSearchLoading,
  placeholder,
}: TypingAutoSearchProps) => {
  const [searchKey, setSearchKey] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const timeOut = useRef<any>(null);

  useEffect(() => {
    if (!isTyping) onSearchSubmit(searchKey);
  }, [isTyping]);

  return (
    <Container>
      <Search
        loading={isSearchLoading}
        value={searchKey}
        allowClear
        addonAfter={
          <Icon
            type="close-circle-o"
            onClick={() => {
              //   onSearchSubmit('')
            }}
          />
        }
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            // onSearchSubmit(searchKey)
          }
        }}
        onSearch={(value, event) => {
          //   onSearchSubmit(value)
        }}
        placeholder={placeholder}
        onChange={(e) => {
          setSearchKey(e.target.value);
          if (timeOut.current) {
            setIsTyping(true);
            clearTimeout(timeOut.current);
          }
          timeOut.current = setTimeout(() => {
            setIsTyping(false);
          }, 300);
          // setParams({ ...params, search: value })
        }}
      />
    </Container>
  );
};

export default TypingAutoSearch;

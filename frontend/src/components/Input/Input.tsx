import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

type TInputProps = {
  type?: React.HTMLInputTypeAttribute;
  errorMsg?: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  errorClassName?: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  type = "text",
  errorMsg,
  name,
  register,
  className = "w-full p-4 border border-gray-300 rounded-sm outline-none lg:text-xl focus:border-gray-500 focus:shadow-sm",
  containerClassName = "",
  errorClassName = "mt-1 text-red-600 lg:text-xl mt-[6px] min-h-[1.25rem] text-sm",
  placeholder = "",
  rules,
  ...rest
}: TInputProps) => {
  const registerResult = register && name ? register(name, rules) : {};
  return (
    <div className={containerClassName}>
      <input
        type={type}
        placeholder={placeholder}
        className={classNames(
          `${className}`,
          // Error!
          {
            "border-red-600 bg-red-50 focus:border-red-600  ": errorMsg,
          },
          // Custom classNames
        )}
        {...rest}
        {...registerResult}
      />
      <div className={errorClassName}>{errorMsg}</div>
    </div>
  );
};

export default Input;

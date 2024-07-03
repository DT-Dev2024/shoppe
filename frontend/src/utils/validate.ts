import { TAddress, ValidationResult } from "src/types/user.types";
export function validateAddressFields(address: TAddress): ValidationResult {
  const errors: ValidationResult = {};

  // Xác thực tên
  if (!address.name || address.name.length < 2) {
    errors.name = "Tên phải có ít nhất 2 ký tự.";
  }

  // Xác thực số điện thoại
  const phonePattern = /^\d{10}$/;
  if (!phonePattern.test(address.phone)) {
    errors.phone = "Số điện thoại phải có 10 chữ số.";
  }

  // Xác thực địa chỉ
  if (!address.address || address.address.length < 10) {
    errors.address = "Địa chỉ phải có ít nhất 10 ký tự.";
  }

  return errors;
}

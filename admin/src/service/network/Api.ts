import { ApiClient, BASE_URL_DEV, URL_IMAGE } from "../ApiService";

export const requestAddPayment = (payload: any) =>
  ApiClient.post(`api/payment`, payload);

export const requestGetPayment = () => ApiClient.get(`api/payment`);
export const requestLogin = (payload: any) =>
  ApiClient.post(`api/auth/admin-login`, payload);
// export const requestGetProfile = () => ApiClient.get(`/api/v1/admin/profile`);

export const requestGetTransaction = (id: string) =>
  ApiClient.get(`${BASE_URL_DEV}/api/order/order-history/${id}`);

export const requestDeleteTransaction = (id: any) =>
  ApiClient.delete(`/api/v1/admin/transaction/${id}`);

export const requestSuccessTransaction = (id: any) =>
  ApiClient.put(`/api/v1/admin/transaction/${id}/success`);

export const requestRejectTransaction = (payload: any) =>
  ApiClient.put(`/api/v1/admin/transaction/${payload.id}/reject`, payload.body);
export const requestChangePassword = (payload: any) =>
  ApiClient.put(`/api/v1/admin/change-password`, payload);
export const requestResetPassword = (payload: any) =>
  ApiClient.put(`/api/v1/admin/${payload.id}/reset-password`, payload.body);
export const requestGetListAdmin = (payload: any) =>
  ApiClient.get(`${BASE_URL_DEV}/api/voucher`, payload);
export const requestDeleteAccountAdmin = (id: any) =>
  ApiClient.delete(`/api/voucher/${id}`);
export const requestAddNewAccount = (payload: any) =>
  ApiClient.post(`/api/voucher`, payload);

export const requestUpdateVoucher = (payload: any) =>
  ApiClient.patch(`/api/voucher`, payload);
export const requestGetListProduct = () => ApiClient.get(`api/product`);
export const requestUploadImage = (payload: any) =>
  ApiClient.post(`${URL_IMAGE}/upload`, payload);
export const requestAddProduct = (payload: any) =>
  ApiClient.post(`api/product`, payload);

export const requestUpdateProduct = (payload: any) =>
  ApiClient.patch(`api/product/${payload.id}`, payload.body);
export const requestDeleteProduct = (id: any) =>
  ApiClient.delete(`api/product/${id}`);
export const requestGetListOrder = (payload: any) =>
  ApiClient.get(`api/v1/admin/order`, payload);
export const requestRemoveOrder = (id: any) =>
  ApiClient.delete(`api/v1/admin/order/${id}`);
export const requestCompleteOrder = (id: any) =>
  ApiClient.put(`api/v1/admin/order/${id}/complete`);
export const requestProcessOrder = (payload: any) =>
  ApiClient.put(`api/v2/admin/order/process`, payload);
export const requestCountStatusOrder = (status: any) =>
  ApiClient.get(`api/v1/admin/order/${status}/count`);
export const requestGetListMethod = () => ApiClient.get(`api/v1/admin/methob`);
export const requestCommissions = () =>
  ApiClient.get(`api/v1/admin/config-commission`);
export const updateCommissions = (key: string, payload: any) =>
  ApiClient.put(`api/v1/admin/config-commission/${key}`, payload);

export const requestUpdateMethod = (payload: any) =>
  ApiClient.put(`api/v1/admin/methob/${payload.methobName}`, payload.body);
export const requestGetListCustomer = () =>
  ApiClient.get(`${BASE_URL_DEV}/api/users`);
export const requestAdjustmentBalance = (payload: any) =>
  ApiClient.put(
    `${BASE_URL_DEV}/api/users/${payload.userId}/adjustment-balance`,
    payload.body
  );
export const requestResetPasswordCustomer = (payload: any) =>
  ApiClient.put(
    `${BASE_URL_DEV}/api/users/${payload.id}/reset-password`,
    payload.body
  );
export const requestChangePasswordCashOutCustomer = (payload: any) =>
  ApiClient.put(
    `${BASE_URL_DEV}/api/users/${payload.id}/reset-tfa-password`,
    payload.body
  );
export const requestGetListLevel = (payload: any) =>
  ApiClient.get(`api/v1/admin/level`, payload);

export const requestAddVip = (payload: any) =>
  ApiClient.post(`api/v1/admin/level`, payload);

export const requestUpdateInfoVip = (payload: any) =>
  ApiClient.put(`api/v1/admin/level/${payload.key}`, payload.body);

export const requestDeleteVip = (key: any) =>
  ApiClient.delete(`api/v1/admin/level/${key}`);

export const requestAddProductToVip = (payload: any) =>
  ApiClient.post(
    `api/v1/admin/level/${payload.key}/product/${payload.productId}`
  );

export const requestDeleteProductVip = (payload: any) =>
  ApiClient.delete(
    `api/v1/admin/level/${payload.key}/product/${payload.productId}`
  );
export const requestGetStatistic = (payload: any) =>
  ApiClient.get(
    `api/v1/admin/statistic?status=${payload.status}&type=${payload.type}&from=${payload.from}&to=${payload.to}`
  );
export const requestSetVipCustomer = (payload: any) =>
  ApiClient.put(
    `${BASE_URL_DEV}/api/users/${payload.userId}/adjustment-level/${payload.levelKey}`
  );

//category
export const requestGetListCategory = (payload: any) =>
  ApiClient.get(`api/v1/admin/product-category`, payload);

export const requestDeleteCategory = (id: string) =>
  ApiClient.delete(`api/v1/admin/product-category/${id}`);

export const requestAddCategory = (payload: object) =>
  ApiClient.post(`api/v1/admin/product-category`, payload);

export const requestUpdateCategory = (payload: any) =>
  ApiClient.put(`api/v1/admin/product-category/${payload.id}`, payload.body);

// customer

export const requestBlockCashOut = (id: any) =>
  ApiClient.patch(`${BASE_URL_DEV}/api/users/${id}/block-cashout`);

export const requestBlockOrder = (id: any) =>
  ApiClient.patch(`${BASE_URL_DEV}/api/users/${id}/block-create-order`);

export const requestFreezeBalance = (payload: any) =>
  ApiClient.put(
    `${BASE_URL_DEV}/api/users/${payload.userId}/freeze-balance`,
    payload.body
  );

export const requestDefrostBalance = (payload: any) =>
  ApiClient.put(
    `${BASE_URL_DEV}/api/users/${payload.userId}/defrost-balance`,
    payload.body
  );

//order

export const requestAllOrder = () => ApiClient.get(`${BASE_URL_DEV}/api/order`);
export const updateStatusOrder = (payload: any) =>
  ApiClient.patch(`${BASE_URL_DEV}/api/order/update-status`, payload);

export const requestFrozen = (id: any) =>
  ApiClient.put(`api/v2/admin/order/${id}/frozen`);

export const requestDefrost = (id: any) =>
  ApiClient.put(`api/v2/admin/order/${id}/defrost`);
export const requestProductMustPurchase = (payload: any) =>
  ApiClient.put(
    `api/v2/admin/order/${payload.userId}/product-must-purchase/${payload.productId}`
  );

export const requestUpdateLimitOrder = (payload: any) =>
  ApiClient.put(
    `${BASE_URL_DEV}/api/users/${payload.userId}/update-limit-order`,
    payload.body
  );

export const requestGetListProductVip = (key: any) =>
  ApiClient.get(`api/v1/admin/level/${key}`);

export const requestUpdateLimitOrderAndProductMustPurchase = (payload: any) =>
  ApiClient.put(
    `${BASE_URL_DEV}/api/users/${payload.userId}/update-limit-order-product-must-purchase`,
    payload.body
  );

export const requestDeleteCus = (id: any) =>
  ApiClient.delete(`${BASE_URL_DEV}/api/users/${id}`);

export const requestUpdateInfoCus = (payload: any) =>
  ApiClient.patch(`${BASE_URL_DEV}/api/users`, payload);
export const requestDeleteListUser = (payload: any) =>
  ApiClient.put(`${BASE_URL_DEV}/api/users/delete-customer`, payload);

export const requestDeleteListOrder = (payload: any) =>
  ApiClient.put(`api/v2/admin/order/delete-order`, payload);

export const requestLogHistory = (payload: any) =>
  ApiClient.get(`/api/v1/admin/history`, payload);

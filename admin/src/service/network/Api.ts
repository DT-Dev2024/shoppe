import { ApiClient, BASE_URL_DEV, URL_IMAGE } from "../ApiService";

export const requestLogin = (payload: any) =>
  ApiClient.post(`api/auth/admin-login`, payload);
export const requestGetProfile = () => ApiClient.get(`/api/v1/admin/profile`);
export const requestGetTransaction = (payload: any) =>
  ApiClient.get(`api/v1/admin/transaction`, payload);
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
  ApiClient.get(`${BASE_URL_DEV}/api/v1/admin/`, payload);
export const requestDeleteAccountAdmin = (id: any) =>
  ApiClient.delete(`${BASE_URL_DEV}/api/v1/admin/${id}`);
export const requestAddNewAccount = (payload: any) =>
  ApiClient.post(`${BASE_URL_DEV}/api/v1/admin/`, payload);
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
export const requestGetListCustomer = (payload: any) =>
  ApiClient.get(`api/v1/admin/customer`, payload);
export const requestAdjustmentBalance = (payload: any) =>
  ApiClient.put(
    `api/v1/admin/customer/${payload.userId}/adjustment-balance`,
    payload.body
  );
export const requestResetPasswordCustomer = (payload: any) =>
  ApiClient.put(
    `api/v1/admin/customer/${payload.id}/reset-password`,
    payload.body
  );
export const requestChangePasswordCashOutCustomer = (payload: any) =>
  ApiClient.put(
    `api/v1/admin/customer/${payload.id}/reset-tfa-password`,
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
    `api/v1/admin/customer/${payload.userId}/adjustment-level/${payload.levelKey}`
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
  ApiClient.patch(`api/v1/admin/customer/${id}/block-cashout`);

export const requestBlockOrder = (id: any) =>
  ApiClient.patch(`api/v1/admin/customer/${id}/block-create-order`);

export const requestFreezeBalance = (payload: any) =>
  ApiClient.put(
    `api/v1/admin/customer/${payload.userId}/freeze-balance`,
    payload.body
  );

export const requestDefrostBalance = (payload: any) =>
  ApiClient.put(
    `api/v1/admin/customer/${payload.userId}/defrost-balance`,
    payload.body
  );

//order

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
    `api/v1/admin/customer/${payload.userId}/update-limit-order`,
    payload.body
  );

export const requestGetListProductVip = (key: any) =>
  ApiClient.get(`api/v1/admin/level/${key}`);

export const requestUpdateLimitOrderAndProductMustPurchase = (payload: any) =>
  ApiClient.put(
    `api/v1/admin/customer/${payload.userId}/update-limit-order-product-must-purchase`,
    payload.body
  );

export const requestDeleteCus = (id: any) =>
  ApiClient.delete(`api/v1/admin/customer/${id}`);

export const requestUpdateInfoCus = (payload: any) =>
  ApiClient.put(
    `api/v1/admin/customer/${payload.userId}/update-customer-info`,
    payload.body
  );
export const requestDeleteListUser = (payload: any) =>
  ApiClient.put(`api/v1/admin/customer/delete-customer`, payload);

export const requestDeleteListOrder = (payload: any) =>
  ApiClient.put(`api/v2/admin/order/delete-order`, payload);

export const requestLogHistory = (payload: any) =>
  ApiClient.get(`/api/v1/admin/history`, payload);

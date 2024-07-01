import Cookies from "js-cookie";
import axios from "axios";
import { SESSION } from "../config/constants";
const BASE_URL = "http://15.235.128.184:3001/api/v1/admin/";
interface callApiProps {
  API: any;
  payload?: any;
  context?: any;
  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
  onFinaly?: () => void;
  typeLoading: "isLoading" | "isDialogLoading";
}

interface callApiHookProps {
  API: any;
  payload?: any;
  loading?: (isLoading: boolean) => void;
  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
  onFinaly?: () => void;
  typeLoading?: "isLoading" | "isDialogLoading";
}

export async function callAPIHook({
  API,
  payload = null,
  loading,
  onSuccess,
  onError,
  onFinaly,
}: callApiHookProps) {
  if (loading)
    try {
      loading(true);
      const res = await API(payload);
      if (onSuccess) onSuccess(res);
      loading(false);
    } catch (error) {
      loading(false);
      if (onError) onError(error);
    } finally {
      if (onFinaly) onFinaly();
    }
  else
    try {
      const res = await API(payload);

      if (onSuccess) onSuccess(res);
    } catch (error) {
      if (onError) onError(error);
    } finally {
      if (onFinaly) onFinaly();
    }
}

export function callAPI({
  api,
  type,
  payload,
  beforeSend,
  onSuccess,
  onError,
  params,
}: any) {
  let headers = {};
  const token = Cookies.get(SESSION);

  if (token) headers = { Authorization: `Bearer ${Cookies.get(SESSION)}` };

  !!beforeSend && beforeSend();
  axios({
    url: BASE_URL + api,
    headers,
    method: type,
    data: payload,
    params,
  })
    .then((res) => onSuccess(res.data))
    .catch(onError);
}

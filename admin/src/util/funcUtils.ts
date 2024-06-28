import moment from "moment";
import { toast } from "react-toastify";
import { URL_IMAGE } from "../service/ApiService";

const showToast = (msg: string, type: "success" | "error" = "success") => {
  // if (type == 'success')
  toast[type](msg, {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};

export function formatPrice(num: any) {
  if (
    num === null ||
    num === undefined ||
    num == 0 ||
    Number.isNaN(parseFloat(num))
  )
    return 0;
  var result = num.toString().replace(/,/g, "");
  return result.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
// export function formatPrice(num: string) {
//   if (
//     num === null ||
//     num === undefined ||
//     num == "0" ||
//     Number.isNaN(parseFloat(num))
//   )
//     return "";
//   var result = num.toString().replace(/,/g, "");
//   return result
//     .toString()
//     .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
//     .replace(
//       /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|' '|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
//       ""
//     );
// }

export { showToast };

export function convertDataToFrom(data: any) {
  if (!data) {
    return {
      name: null,
      price: null,
      icon_url: null,
    };
  } else {
    return {
      name: data.name,
      price: data.price,
      icon_url: URL_IMAGE + data.image,
    };
  }
}

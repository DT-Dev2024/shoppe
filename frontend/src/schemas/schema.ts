import { TQueryConfig } from "src/types/query.type";
import * as yup from "yup";

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as Pick<TQueryConfig, "price_max" | "price_min">;
  if (price_min !== "" && price_max !== "") {
    return Number(price_max) >= Number(price_min);
  }
  return price_min !== "" || price_max !== "";
}

export const schema = yup.object({
  phone: yup.string().required("Không được để trống số điện thoại"),

  price_min: yup.string().test({
    name: "price-not-allowed",
    message: "Khoảng giá không hợp lệ",
    test: testPriceMinMax,
  }),
  price_max: yup.string().test({
    name: "price-not-allowed",
    message: "Khoảng giá không hợp lệ",
    test: testPriceMinMax,
  }),
  search: yup.string().trim().required(),
});

export const loginSchema = schema.pick(["phone"]);
export const priceRangeSchema = schema.pick(["price_min", "price_max"]);
export const searchQuerySchema = schema.pick(["search"]);

export type TLoginSchemaType = yup.InferType<typeof loginSchema>;
export type TPriceRangeType = Required<yup.InferType<typeof priceRangeSchema>>;
export type TSearchQueryType = yup.InferType<typeof searchQuerySchema>;

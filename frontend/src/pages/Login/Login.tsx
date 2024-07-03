import { yupResolver } from "@hookform/resolvers/yup";
import { isAxiosError } from "axios";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginAccount } from "src/apis/auth.api";
import Button from "src/components/Button";
import { Input } from "src/components/Input";
import { path } from "src/constants/path.enum";
import { AuthContext } from "src/contexts/auth.context";
import { loginSchema, TLoginSchemaType } from "src/schemas/schema";
import { TErrorApiResponse } from "src/types/utils.types";
import { isAxiosUnprocessableEntity } from "src/utils/isAxiosError";

type FormData = TLoginSchemaType;

const Login = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const response = await loginAccount(data);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      navigate(path.home);
    } catch (error) {
      if (
        isAxiosError<TErrorApiResponse<FormData>>(error) &&
        isAxiosUnprocessableEntity<TErrorApiResponse<FormData>>(error)
      ) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, { message: formError[key as keyof FormData], type: "server" });
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
      <Helmet>
        <title>Đăng nhập</title>
        <meta
          name="description"
          content="Trang đăng nhập của Shopee At Home"
        />
      </Helmet>
      <div className="lg:col-span-2 lg:col-start-4">
        <form
          className="rounded bg-white p-10 shadow-sm"
          noValidate
          autoComplete="on"
        >
          <div className="text-2xl lg:text-3xl">Đăng nhập tài khoản</div>
          <Input
            type="text"
            errorMsg={errors.phone?.message}
            name="phone"
            register={register}
            placeholder="Số điện thoại"
            containerClassName="mt-6"
          ></Input>
          <div className="mt-3">
            <Button
              type="button"
              isLoading={isLoading}
              onClick={handleLogin}
              containerClassName="mt-1  lg:text-xl "
            >
              Đăng nhập
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <span className="text-gray-400 lg:text-xl ">Bạn chưa có tài khoản?</span>
            <Link
              className="ml-4 text-red-400 lg:text-xl "
              to={path.login}
            >
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

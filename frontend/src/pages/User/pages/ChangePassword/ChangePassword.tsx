import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "src/components/Input";
import { registerSchema, TRegisterSchema } from "src/schemas/schema";
import authApi from "src/apis/auth.api";
import omit from "lodash/omit";
import { isAxiosError, isAxiosUnprocessableEntity } from "src/utils/isAxiosError";
import { TErrorApiResponse } from "src/types/utils.types";
import { useContext, useState } from "react";
import { AuthContext } from "src/contexts/auth.context";
import Button from "src/components/Button";
import { path } from "src/constants/path.enum";
import { Helmet } from "react-helmet-async";

type FormData = TRegisterSchema;

const Register = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    reValidateMode: "onBlur",
    resolver: yupResolver(registerSchema),
  });
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserProfile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = handleSubmit(async (data) => {
    const body = omit(data, ["confirm_password"]);
    try {
      setIsLoading(true);
      const response = await authApi.registerAccount(body);
      setIsAuthenticated(true);
      setUserProfile(response.data.data.user);
      navigate(path.home);
    } catch (error) {
      if (
        isAxiosError<TErrorApiResponse<Omit<FormData, "confirm_password">>>(error) &&
        isAxiosUnprocessableEntity<TErrorApiResponse<Omit<FormData, "confirm_password">>>(error)
      ) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof Omit<FormData, "confirm_password">, {
              message: formError[key as keyof Omit<FormData, "confirm_password">],
              type: "server",
            });
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-24 lg:pr-10">
      <Helmet>
        <title>Đăng ký</title>
        <meta
          name="description"
          content={`Trang đăng ký của Shopee At Home`}
        />
      </Helmet>
      <div className="lg:col-span-2 lg:col-start-4">
        <form
          onSubmit={handleSignUp}
          className="rounded bg-white p-10 shadow-sm"
          noValidate
          autoComplete="on"
        >
          <div className="text-2xl">Đăng ký tài khoản</div>
          <Input
            type="email"
            name="email"
            register={register}
            containerClassName="mt-8"
            placeholder="Địa chỉ e-mail"
            errorMsg={errors.email?.message}
          ></Input>
          <Input
            type="password"
            name="password"
            register={register}
            containerClassName="mt-1"
            placeholder="Nhập mật khẩu của bạn"
            errorMsg={errors.password?.message}
          ></Input>
          <Input
            type="password"
            name="confirm_password"
            register={register}
            containerClassName="mt-1"
            placeholder="Nhập lại mật khẩu của bạn"
            errorMsg={errors.confirm_password?.message}
          ></Input>
          <Button
            type="submit"
            isLoading={isLoading}
            containerClassName="mt-1"
          >
            Đăng ký
          </Button>
          <div className="mt-8 flex items-center justify-center">
            <span className="text-gray-400">Bạn đã có tài khoản?</span>
            <Link
              className="ml-1 text-red-400"
              to={path.login}
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

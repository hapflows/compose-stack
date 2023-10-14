"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Field, Input, Title, Button, Box } from "@compose-stack-ui/ui";

import { LoginFormState } from "./LoginForm.types";
import { useLoginFormValidation } from "./useLoginFormValidation";
import { useLogin } from "../../hooks/useLogin";

export function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const resolver = useLoginFormValidation();
  const [responseError, setResponseError] = useState<string | null>(null);
  const router = useRouter();

  const { loading, login, onLogin } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormState>({
    resolver,
  });

  const onSubmit = async (props: LoginFormState) => {
    setResponseError(null);
    const loginResponse = await login(props.email, props.password);
    if (!loginResponse.success) {
      setResponseError("Email or password not valid");
      return;
    }
    onLogin(loginResponse.userTokens);
    router.push("/dashboard");
  };

  return (
    <div className="w-500">
      <div className="flex-center-center">
        <Title tag="h3" className="color-black">
          Sign In
        </Title>
      </div>
      <Box shadowed={true}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            label="Email"
            htmlFor="email"
            description={errors.email?.message}
            descriptionProps={{ className: "color-negative" }}
          >
            <Input
              {...register("email")}
              size="md"
              invalid={!!errors.email}
              disabled={loading}
            />
          </Field>
          <Field
            label="Password"
            htmlFor="password"
            description={errors.password?.message}
            descriptionProps={{ className: "color-negative" }}
          >
            <Input
              {...register("password")}
              size="md"
              type={passwordVisible ? "text" : "password"}
              invalid={!!errors.password}
              disabled={loading}
              rightIconProps={{
                name: passwordVisible ? "visibility" : "visibility_off",
                onClick: () => setPasswordVisible((v) => !v),
              }}
            />
          </Field>
          {responseError && (
            <Box header="Error" variant="warning">
              {responseError}
            </Box>
          )}
          <Button
            type="submit"
            className="w-100pc m-t-20"
            isLoading={loading}
            variant="primary"
          >
            Login
          </Button>
        </form>
      </Box>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Field, Input, Title, Button, Box } from "@compose-stack-ui/ui";

import { authService } from "../../../services/auth";
import { RegisterFormProps, RegisterFormState } from "./RegisterForm.types";
import { useRegisterFormValidation } from "./useRegisterFormValidation";
import { getPasswordError } from "@/apps/auth/utils/getPasswordError";
import { RegisterResponse } from "@/apps/auth/services/auth.types";

export function RegisterForm({
  onRegisterComplete,
  onCancel,
  loginLoading,
}: RegisterFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const resolver = useRegisterFormValidation();
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);
  const isLoading = loginLoading || loading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormState>({
    resolver,
  });

  const onSubmit = async (props: RegisterFormState) => {
    setResponseError(null);
    setLoading(true);
    let registerResponse;
    try {
      registerResponse = await authService.register(
        props.first_name,
        props.last_name,
        props.email,
        props.password
      );
      setLoading(false);
      if (registerResponse.error) {
        setError(registerResponse, setResponseError);
        return;
      }
    } catch (e) {
      setResponseError("Something went wrong. Please check your password.");
      setLoading(false);
      return;
    }
    onRegisterComplete({
      email: props.email,
      password: props.password,
      verificationToken: registerResponse.verificationToken!,
      registrationCode: registerResponse.registrationCode,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="First name"
          htmlFor="first_name"
          description={errors.first_name?.message}
          descriptionProps={{ className: "color-negative" }}
        >
          <Input
            {...register("first_name")}
            size="md"
            invalid={!!errors.first_name}
            disabled={isLoading}
          />
        </Field>
        <Field
          label="Last name"
          htmlFor="last_name"
          description={errors.last_name?.message}
          descriptionProps={{ className: "color-negative" }}
        >
          <Input
            {...register("last_name")}
            size="md"
            invalid={!!errors.last_name}
            disabled={isLoading}
          />
        </Field>
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
            disabled={isLoading}
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
            disabled={isLoading}
            rightIconProps={{
              name: passwordVisible ? "visibility" : "visibility_off",
              onClick: () => setPasswordVisible((v) => !v),
            }}
          />
        </Field>
        {responseError && (
          <Box header="Error" variant="error" className="m-t-20">
            {responseError}
          </Box>
        )}
        <Button
          type="submit"
          className="w-100pc m-t-20"
          isLoading={isLoading}
          variant="primary"
        >
          Register
        </Button>
        <Button
          className="w-100pc m-t-20"
          onClick={onCancel}
          isLoading={isLoading}
          variant="neutral-outline"
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}

function setError(
  response: RegisterResponse,
  setResponseError: (message: string) => void
) {
  if (!response.error) return;
  let message = "An error occurred.";
  switch (response.error.detail.code) {
    case "ErrorCode.REGISTER_INVALID_PASSWORD": {
      message = getPasswordError(response.error.detail.reason);
      break;
    }
    case "ErrorCode.REGISTER_USER_ALREADY_EXISTS": {
      message =
        "These email has already been used. You can use the reset password functionality to restore your account.";
      break;
    }
    default: {
    }
  }
  setResponseError(message);
}

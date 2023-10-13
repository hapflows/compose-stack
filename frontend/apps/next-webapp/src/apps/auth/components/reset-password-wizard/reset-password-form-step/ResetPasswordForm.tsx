"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Box, Button, Field, Input, Title } from "@compose-stack-ui/ui";

import {
  ResetPasswordFormProps,
  ResetPasswordFormState,
} from "./ResetPasswordForm.types";
import { authService } from "@/apps/auth/services/auth";
import { getPasswordError } from "@/apps/auth/utils/getPasswordError";
import { useResetPasswordFormValidation } from "./useResetPasswordFormValidation";

export function ResetPasswordForm({
  onResetPasswordCompleted,
  resetToken,
}: ResetPasswordFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const resolver = useResetPasswordFormValidation();
  const [responseError, setResponseError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormState>({
    resolver,
  });

  const onSubmit = async (props: ResetPasswordFormState) => {
    setResponseError(null);
    setLoading(true);
    try {
      await authService.resetPassword(props.email, props.password, resetToken);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setResponseError(
        `Something wrong happened. Check your email and password (they must match). ${getPasswordError()}`
      );
      setLoading(false);
      return;
    }

    onResetPasswordCompleted();
  };

  return (
    <div>
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
          <Field
            label="Confirm Password"
            htmlFor="confirm_password"
            description={errors.confirm_password?.message}
            descriptionProps={{ className: "color-negative" }}
          >
            <Input
              {...register("confirm_password")}
              size="md"
              type={passwordVisible ? "text" : "password"}
              invalid={!!errors.confirm_password}
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
            Reset Password
          </Button>
          <Button
            type="submit"
            className="w-100pc m-t-20"
            isLoading={loading}
            variant="neutral-outline"
          >
            Cancel
          </Button>
        </form>
      </Box>
    </div>
  );
}

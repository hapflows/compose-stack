"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Field, Input, Button, Box, Text } from "@compose-stack-ui/ui";

import { authService } from "../../../services/auth";
import {
  EmailVerificationFormState,
  EmailVerificationFormProps,
} from "./EmailVerificationForm.types";
import { useEmailVerificationFormValidation } from "./useEmailVerificationFormValidation";

export function EmailVerificationForm({
  verificationToken,
  onVerificationCompleted,
  onCancel,
  loginLoading,
}: EmailVerificationFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const resolver = useEmailVerificationFormValidation();
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);
  const isLoading = loginLoading || loading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailVerificationFormState>({
    resolver,
  });

  const onSubmit = async (props: EmailVerificationFormState) => {
    setResponseError(null);
    setLoading(true);
    let registerResponse;
    try {
      registerResponse = await authService.verify(
        verificationToken,
        props.registrationCode
      );
      setLoading(false);
    } catch (e) {
      setResponseError(
        "Something went wrong. Please check your registration code."
      );
      setLoading(false);
      return;
    }
    onVerificationCompleted();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text>A Registration Code has been sent to your email.</Text>
        <Text>Please check your inbox and input the provided code here:</Text>
        <Field
          htmlFor="registrationCode"
          description={errors.registrationCode?.message}
          descriptionProps={{ className: "color-negative" }}
        >
          <Input
            {...register("registrationCode")}
            size="md"
            invalid={!!errors.registrationCode}
            disabled={isLoading}
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
          Verify
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

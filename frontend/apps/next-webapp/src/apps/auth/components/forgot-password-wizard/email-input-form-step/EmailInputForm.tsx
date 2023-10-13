"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Field, Input, Button, Box } from "@compose-stack-ui/ui";

import { authService } from "../../../services/auth";
import {
  EmailInputFormProps,
  EmailInputFormState,
} from "./EmailInputForm.types";
import { useEmailInputFormValidation } from "./useEmailInputFormValidation";

export function EmailInputForm({
  onEmailInputComplete,
  onCancel,
}: EmailInputFormProps) {
  const resolver = useEmailInputFormValidation();
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailInputFormState>({
    resolver,
  });

  const onSubmit = async (props: EmailInputFormState) => {
    setResponseError(null);
    setLoading(true);
    let registerResponse;
    try {
      registerResponse = await authService.forgotPassword(props.email);
    } catch (e) {
      setResponseError("Something went wrong. Please check your password.");
      setLoading(false);
      return;
    }
    onEmailInputComplete();
  };

  return (
    <div>
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
        {responseError && (
          <Box header="Error" variant="error" className="m-t-20">
            {responseError}
          </Box>
        )}
        <Button
          type="submit"
          className="w-100pc m-t-20"
          isLoading={loading}
          variant="primary"
        >
          Request reset code
        </Button>
        <Button
          className="w-100pc m-t-20"
          onClick={onCancel}
          isLoading={loading}
          variant="neutral-outline"
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}

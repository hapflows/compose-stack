"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DefaultErrorPage from "next/error";

import { Box, Title } from "@compose-stack-ui/ui";

import { ResetPasswordCompleted } from "./completed-step/ResetPasswordCompleted";
import { ResetPasswordWizardState } from "./ResetPasswordWizard.types";
import { ResetPasswordForm } from "./reset-password-form-step/ResetPasswordForm";

export function ResetPasswordWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("reset_token");

  const [resetPasswordState, setResetPasswordState] =
    useState<ResetPasswordWizardState>({
      step: "reset-password-form",
    });

  if (!resetToken) return <DefaultErrorPage statusCode={404} />;

  const onCancel = () => {
    router.push("/login");
  };
  const onResetPasswordCompleted = () => {
    setResetPasswordState({ step: "completed" });
  };
  const onComplete = () => {
    router.push("/login");
  };

  return (
    <div className="w-500">
      <div className="flex-center-center">
        <Title tag="h3" className="color-black">
          Reset Password
        </Title>
      </div>
      <Box shadowed={true}>
        {resetPasswordState.step === "reset-password-form" && (
          <ResetPasswordForm
            onResetPasswordCompleted={onResetPasswordCompleted}
            onCancel={onCancel}
            resetToken={resetToken}
          />
        )}
        {resetPasswordState.step === "completed" && (
          <ResetPasswordCompleted onComplete={onComplete} />
        )}
      </Box>
    </div>
  );
}

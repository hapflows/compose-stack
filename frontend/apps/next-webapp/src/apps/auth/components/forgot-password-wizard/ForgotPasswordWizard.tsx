"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Box, Title } from "@compose-stack-ui/ui";

import { ForgotPasswordWizardState } from "./ForgotPasswordWizard.types";
import { EmailInputForm } from "./email-input-form-step/EmailInputForm";
import { ForgotPasswordCompleted } from "./completed-step/ForgotPasswordCompleted";

export function ForgotPasswordWizard() {
  const router = useRouter();
  const [forgotPasswordState, setForgotPAsswordState] =
    useState<ForgotPasswordWizardState>({
      step: "email-input-form",
    });

  const onCancel = () => {
    router.push("/");
  };

  const onEmailInputComplete = async () => {
    setForgotPAsswordState({
      step: "completed",
    });
  };

  const onComplete = () => {
    router.push("/login");
  };

  return (
    <div className="w-500">
      <div className="flex-center-center">
        <Title tag="h3" className="color-black">
          Forgot Password
        </Title>
      </div>
      <Box shadowed={true}>
        {forgotPasswordState.step === "email-input-form" && (
          <EmailInputForm
            onEmailInputComplete={onEmailInputComplete}
            onCancel={onCancel}
          />
        )}
        {forgotPasswordState.step === "completed" && (
          <ForgotPasswordCompleted onComplete={onComplete} />
        )}
      </Box>
    </div>
  );
}

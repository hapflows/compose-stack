"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Box, Title } from "@compose-stack-ui/ui";

import { authService } from "../../services/auth";
import { useLogin } from "../../hooks/useLogin";
import { RegisterData, RegisterState } from "./RegisterWizard.types";
import { RegisterForm } from "./register-form-step/RegisterForm";
import { EmailVerificationForm } from "./email-verification-form-step/EmailVerificationForm";

export function RegisterWizard() {
  const router = useRouter();
  const { loading: loginLoading, onLogin, login } = useLogin();
  const [errorMessage, setErrorMessage] = useState("");
  const [registerState, setRegisterState] = useState<RegisterState>({
    step: "register",
  });

  const onCancel = () => {
    router.push("/");
  };

  const onRegisterComplete = async (registerData: RegisterData) => {
    // If the server sends the verification code as response,
    // we verify silently
    if (registerData.registrationCode) {
      await authService.verify(
        registerData.verificationToken!,
        registerData.registrationCode!
      );
      const loginResponse = await login(
        registerData.email,
        registerData.password
      );
      if (!loginResponse.success) {
        setErrorMessage(loginResponse.message);
        return;
      }
      onLogin(loginResponse.userTokens);
      onComplete();
    } else {
      // otherwise, we ask the user to input the verification code
      // they received via email
      setRegisterState({
        step: "email-verification",
        email: registerData.email,
        password: registerData.password,
        verificationToken: registerData.verificationToken,
      });
    }
  };

  const onVerificationCompleted = async () => {
    if (registerState.step !== "email-verification") return;

    const loginResponse = await login(
      registerState.email,
      registerState.password
    );
    if (!loginResponse.success) {
      setErrorMessage(loginResponse.message);
      return;
    }
    onLogin(loginResponse.userTokens);
    onComplete();
  };

  const onComplete = () => {
    router.push("/dashboard");
  };

  return (
    <div className="w-500">
      <div className="flex-center-center">
        <Title tag="h3" className="color-black">
          Register
        </Title>
      </div>
      <Box shadowed={true}>
        {registerState.step === "register" && (
          <RegisterForm
            onRegisterComplete={onRegisterComplete}
            onCancel={onCancel}
            loginLoading={loginLoading}
          />
        )}
        {registerState.step === "email-verification" && (
          <EmailVerificationForm
            verificationToken={registerState.verificationToken}
            onVerificationCompleted={onVerificationCompleted}
            onCancel={onCancel}
            loginLoading={loginLoading}
          />
        )}
      </Box>
      {errorMessage && (
        <Box variant="warning" header="Error">
          {errorMessage}
        </Box>
      )}
    </div>
  );
}

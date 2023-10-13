import { RegisterData } from "../RegisterWizard.types";

export interface EmailVerificationFormState {
  registrationCode: string;
}

export interface RegisterFormResultState {
  registration_code?: string;
}

export interface EmailVerificationFormProps {
  verificationToken: string;
  onVerificationCompleted: () => void;
  onCancel: () => void;
  loginLoading: boolean;
}

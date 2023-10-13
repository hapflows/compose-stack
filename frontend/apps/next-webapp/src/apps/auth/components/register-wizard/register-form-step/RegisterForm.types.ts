import { RegisterData } from "../RegisterWizard.types";

export interface RegisterFormState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface RegisterFormResultState {
  registration_code?: string;
}

export interface RegisterFormProps {
  onRegisterComplete: (registerResponse: RegisterData) => void;
  onCancel: () => void;
  loginLoading: boolean;
}

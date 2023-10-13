export interface EmailInputFormState {
  email: string;
}

export interface EmailInputFormProps {
  onEmailInputComplete: () => void;
  onCancel: () => void;
}

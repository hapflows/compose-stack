export interface ResetPasswordFormProps {
  resetToken: string;
  onCancel: () => void;
  onResetPasswordCompleted: () => void;
}

export interface ResetPasswordFormState {
  email: string;
  password: string;
  confirm_password: string;
}

export interface UserTokens {
  access_token: string;
  access_token_expiration?: number;
  refresh_token?: string;
  refresh_token_expiration?: number;
}

export interface RegisterResponse {
  register?: any;
  verificationToken?: string;
  registrationCode?: string;
  error?: {
    detail: RegisterResponseErrorDetail;
  };
}
export interface RequestVerificationTokenResponse {
  verification_token: string;
  registration_code?: string;
}

export type InvalidPasswordReason =
  | "TOO_SHORT"
  | "NO_UPPERCASE"
  | "NO_LOWERCASE"
  | "NO_NUMBER"
  | "NO_SPECIAL_CHAR";

type RegisterResponseErrorDetail =
  | {
      code: "ErrorCode.REGISTER_INVALID_PASSWORD";
      reason: InvalidPasswordReason;
    }
  | {
      code: "ErrorCode.REGISTER_USER_ALREADY_EXISTS";
    };

export interface ForgotPasswordResponse {
  token_sent: boolean;
}

export interface ResetPasswordResponse {
  password_reset: boolean;
}

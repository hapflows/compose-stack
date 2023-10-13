export type RegisterState =
  | {
      step: "register";
    }
  | {
      step: "email-verification";
      email: string;
      password: string;
      verificationToken: string;
    };

export interface RegisterData {
  email: string;
  password: string;
  verificationToken: string;
  registrationCode?: string;
}

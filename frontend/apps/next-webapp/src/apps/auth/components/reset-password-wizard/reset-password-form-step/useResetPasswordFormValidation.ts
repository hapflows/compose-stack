import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const useResetPasswordFormValidation = () => {
  const schema = {
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
  };

  return zodResolver(z.object(schema));
};

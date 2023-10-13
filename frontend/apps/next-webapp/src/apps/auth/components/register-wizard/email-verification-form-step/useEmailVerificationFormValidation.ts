import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const useEmailVerificationFormValidation = () => {
  const schema = {
    registrationCode: z.string().min(6),
  };

  return zodResolver(z.object(schema));
};

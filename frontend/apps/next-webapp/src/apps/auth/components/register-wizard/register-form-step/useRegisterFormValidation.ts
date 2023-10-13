import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const useRegisterFormValidation = () => {
  const schema = {
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  };

  return zodResolver(z.object(schema));
};

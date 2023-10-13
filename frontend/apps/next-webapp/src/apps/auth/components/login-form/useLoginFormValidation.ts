import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const useLoginFormValidation = () => {
  const schema = {
    email: z.string().email(),
    password: z.string().min(8),
  };

  return zodResolver(z.object(schema));
};

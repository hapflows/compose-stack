import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const useEmailInputFormValidation = () => {
  const schema = {
    email: z.string().email(),
  };

  return zodResolver(z.object(schema));
};

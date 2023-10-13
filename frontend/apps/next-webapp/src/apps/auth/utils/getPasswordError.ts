import { InvalidPasswordReason } from "../services/auth.types";

export function getPasswordError(reason?: InvalidPasswordReason) {
  // The message can be customized based on reason
  if (reason) console.warn(reason);
  const message =
    "Your password must contain at least one lower case letter, one upper case letter, one number and one special character.";
  return message;
}

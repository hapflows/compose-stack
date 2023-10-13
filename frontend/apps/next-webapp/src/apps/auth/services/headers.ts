import { authService } from "./auth";

export function generateAuthHeaders(
  currentHeaders: HeadersInit = {}
): HeadersInit | undefined {
  const userTokens = authService.getPersistentTokens();
  if (!userTokens) return currentHeaders;

  return {
    ...currentHeaders,
    Authorization: `Bearer ${userTokens.access_token}`,
  };
}

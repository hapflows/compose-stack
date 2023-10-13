import { authService } from "./auth";

export async function refreshToken() {
  const userTokens = authService.getPersistentTokens();

  if (!userTokens || !userTokens.refresh_token) return;
  try {
    const tokens = await authService.refreshTokens(userTokens.refresh_token);

    if ("error" in tokens) {
      authService.removePersistentTokens();
      return false;
    } else {
      authService.savePersistentTokens({ ...userTokens, ...tokens });
      return tokens;
    }
  } catch (e) {
    // authService.removePersistentTokens();
    return false;
  }
}

export function autoRefreshToken(delay: number) {
  setTimeout(async () => {
    // Refresh the tokens
    const refreshed = await refreshToken();
    // if they have been refreshed, do it again
    if (refreshed) autoRefreshToken(delay);
  }, delay);
}

export function decodeJWT(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

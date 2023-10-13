import { requests } from "@/core/requests/requests";

import { UserTokens } from "./auth.types";

const LS_USER_TOKENS_ACCESS_TOKEN = "USER_TOKENS_ACCESS_TOKEN";
const LS_USER_TOKENS_REFRESH_TOKEN = "USER_TOKENS_REFRESH_TOKEN";

export class AuthenticationService {
  /**
   * AUTHENTICATION
   */

  /**
   * Authenticate a user given username and password
   */
  authenticate(username: string, password: string): Promise<UserTokens> {
    const body = `username=${username}&password=${password}`;
    const response = requests.POST<UserTokens>(
      "/login",
      {},
      {
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return response;
  }

  /**
   * Logout the user.
   */
  signOut(username: string) {
    // TODO: send info to server to blacklist refresh token
    return true;
  }

  /**
   * Get new authentication and refresh tokens, by passing a current
   * valid refresh token.
   */
  refreshTokens(refreshToken: string): Promise<UserTokens> {
    return requests.POST("/auth/refresh-tokens", {
      token: refreshToken,
    });
  }

  /**
   * Saves token on localStorage
   */
  savePersistentTokens(userTokens: UserTokens) {
    localStorage.setItem(LS_USER_TOKENS_ACCESS_TOKEN, userTokens.access_token);
    if (userTokens.refresh_token)
      localStorage.setItem(
        LS_USER_TOKENS_REFRESH_TOKEN,
        userTokens.refresh_token
      );
  }

  /**
   * Get tokens from localStorage
   */
  getPersistentTokens(): UserTokens | null {
    const access_token = localStorage.getItem(LS_USER_TOKENS_ACCESS_TOKEN);
    const refresh_token = localStorage.getItem(LS_USER_TOKENS_REFRESH_TOKEN);

    if (!access_token || !refresh_token) return null;

    return {
      access_token,
      refresh_token,
    };
  }

  /**
   * Removes token from localStorage
   */
  removePersistentTokens() {
    localStorage.removeItem(LS_USER_TOKENS_ACCESS_TOKEN);
    localStorage.removeItem(LS_USER_TOKENS_REFRESH_TOKEN);
  }
}

export const authService = new AuthenticationService();

import { requests } from "@/core/requests/requests";

import {
  UserTokens,
  RequestVerificationTokenResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from "./auth.types";

const LS_USER_TOKENS_ACCESS_TOKEN = "USER_TOKENS_ACCESS_TOKEN";
const LS_USER_TOKENS_REFRESH_TOKEN = "USER_TOKENS_REFRESH_TOKEN";

export class AuthenticationService {
  /**
   * REGISTRATION
   */

  /**
   * Registers a user given names, email and password.
   * After creating a user, requests a verification token.
   */
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    };

    return new Promise(async (resolve, reject) => {
      let response: RegisterResponse = {};
      const onError = async (response: Response) => {
        const text = await response.text();
        const error = JSON.parse(text);
        return resolve({ error });
      };
      try {
        response["register"] = await requests.POST("/register", payload, {
          onError,
        });
      } catch (e) {
        console.error(e);
        return reject({ error: e + "" });
      }
      try {
        const registrationTokens =
          await requests.POST<RequestVerificationTokenResponse>(
            "/auth/request-verification-token",
            {
              email,
            }
          );
        response["verificationToken"] =
          registrationTokens.verification_token as string;
        response["registrationCode"] =
          registrationTokens.registration_code as string;
      } catch (e) {
        console.error(e);
        return reject({ error: e + "" });
      }
      return resolve(response);
    });
  }

  /**
   * Verifies a token and the registration code obtained from register method.
   */
  async verify(verificationToken: string, registrationCode: string) {
    return requests.POST("/auth/verify", {
      token: verificationToken,
      registration_code: registrationCode,
    });
  }

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

  /**
   * FORGOT PASSWORD
   */

  /**
   * Request a reset password token.
   */
  forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = requests.POST<ForgotPasswordResponse>(
      "/auth/forgot-password",
      { email }
    );
    return response;
  }

  /**
   * Use a reset password token to change the user password.
   */
  resetPassword(
    email: string,
    password: string,
    token: string
  ): Promise<ResetPasswordResponse> {
    const response = requests.POST<ResetPasswordResponse>(
      "/auth/reset-password",
      {
        email,
        token,
        password,
      }
    );
    return response;
  }
}

export const authService = new AuthenticationService();

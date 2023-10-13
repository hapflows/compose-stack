import { useState } from "react";

import { authService } from "../services/auth";
import { UserTokens } from "../services/auth.types";
import { decodeJWT } from "../services/tokens";
import { useAuthenticationStore } from "../store/authentication.store";
import { AuthenticationUserType } from "../store/authentication.types";
import { onAuthenticationSuccess } from "./useAuthenticationSetup";

type LoginResponse =
  | {
      success: true;
      userTokens: UserTokens;
      message: null;
    }
  | {
      success: false;
      userTokens: null;
      message: string;
    };

export function useLogin() {
  const setUser = useAuthenticationStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const userTokens = await authService.authenticate(email, password);
      setLoading(false);
      return {
        success: true,
        userTokens,
        message: null,
      };
    } catch (e) {
      setLoading(false);
      return {
        success: false,
        userTokens: null,
        message: "Email or password not valid",
      };
    }
  };

  const onLogin = async (userTokens: UserTokens) => {
    authService.savePersistentTokens(userTokens);
    const user: AuthenticationUserType = decodeJWT(userTokens.access_token);
    onAuthenticationSuccess();
    setUser(user);
  };

  return {
    loading,
    login,
    onLogin,
  };
}

import { useCallback } from "react";

import { useAuthenticationStore } from "../store/authentication.store";
import { authService } from "../services/auth";

export function useLogout() {
  const setUser = useAuthenticationStore((s) => s.setUser);
  const user = useAuthenticationStore((s) => s.user);

  const logout = useCallback(async () => {
    if (!user) return;

    await authService.signOut(user.email);
    authService.removePersistentTokens();
    setUser(null);
  }, [setUser, user]);

  return logout;
}

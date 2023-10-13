import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";

import { AuthenticationState } from "./authentication.types";

export const useAuthenticationStore = create<AuthenticationState>()(
  devtools(
    (set) => ({
      isInitialised: false,
      isLoading: false,
      user: null,
      setIsInitialised: (isInitialised) =>
        set(
          (state) => ({ ...state, isInitialised }),
          false,
          "AUTHENTICATION/SET-IS-INITIALISED"
        ),
      setIsLoading: (isLoading) =>
        set(
          (state) => ({ ...state, isLoading }),
          false,
          "AUTHENTICATION/SET-LOADING"
        ),
      setUser: (user) =>
        set(
          produce<AuthenticationState>((state) => {
            if (user) {
              state.user = {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
              };
            } else {
              state.user = null;
            }
          }),
          false,
          "AUTHENTICATION/SET-USER"
        ),
    }),
    { name: "Authentication Store" }
  )
);

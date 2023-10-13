"use client";

import { useEffect, useRef } from "react";

import { requests } from "@/core/requests/requests";

import { authService } from "../services/auth";
import { generateAuthHeaders } from "../services/headers";
import { refreshToken, autoRefreshToken, decodeJWT } from "../services/tokens";
import { useAuthenticationStore } from "../store/authentication.store";
import { SetFlagType, SetUserType } from "../store/authentication.types";

const REFRESH_INTERVAL = 5 * 60 * 1000;
const REFRESH_TOKEN_IF_LESS_THAN_MINUTES = 45;

// Safari fires the window.focus twice when switching tabs.
// This is a know issue in Webkit and has no solution atm, so a code workaround
// is required. Despite snippets using event.relatedTarget seems to work,
// it's not the case in our situation where relatedTarget is undefined,
// so will need investigation to see how the events differ or by adding
// a debounce/check with a ref.

export function useAuthenticationSetup() {
  const initialisationSetupRef = useRef(false);
  const isInitialised = useAuthenticationStore((state) => state.isInitialised);
  const user = useAuthenticationStore((state) => state.user);
  const setIsInitialised = useAuthenticationStore(
    (state) => state.setIsInitialised
  );
  const setUser = useAuthenticationStore((state) => state.setUser);

  useEffect(() => {
    // Early returns:
    // - on SSR or if isInitialised
    if (typeof window === "undefined" || isInitialised) return;
    // - or if the component has already been mounted (React 18+)
    if (initialisationSetupRef.current) return;

    // The double mount of React 18 causes to add the event listener twice
    // so need to use the ref as check
    initialisationSetupRef.current = true;

    const userTokens = authService.getPersistentTokens();

    // The user never authenticated before
    if (!userTokens) {
      setIsInitialised(true);
      return;
    }

    function visibilityChangeTokenRefresh(e: any) {
      if (document.visibilityState === "visible") {
        refreshTokensOnFocus();
      }
    }

    // The user authenticated before, so we need to check if
    // the ID Token is still valid (user might have closed the
    // window and come back few hours later)
    const currentTime = new Date().getTime() / 1000;
    const tokenData = decodeJWT(userTokens.access_token);
    if (currentTime < tokenData.exp) {
      // If token are about to expire, refresh them now
      if (
        (tokenData.exp - currentTime) / 60 <
        REFRESH_TOKEN_IF_LESS_THAN_MINUTES
      )
        refreshToken();
      // In the background, setup the auto refresh
      autoRefreshToken(REFRESH_INTERVAL);

      // Mark as initialised
      onAuthenticationSuccess();
      setIsInitialised(true);
      setUser(tokenData);
    } else {
      // The ID Token is expired, try to refresh
      // Need to call a separated function because useEffect can't
      // be async
      initialiseUpdateTokens(setIsInitialised, setUser);
    }

    // When the focus is back to the window (from a tab switch or application switch)
    // we need to check if the tokens are still valid.
    window.addEventListener("focus", (e) => visibilityChangeTokenRefresh(e));
  }, [isInitialised, setIsInitialised, setUser]);

  return {
    user,
    isInitialised,
  };
}

async function initialiseUpdateTokens(
  setIsInitialised: SetFlagType,
  setUser: SetUserType
) {
  const refreshed = await refreshToken();
  // ID Token has been refreshed successfully, keep it updated
  if (refreshed) {
    onAuthenticationSuccess();
    setUser(decodeJWT(refreshed.access_token));
    autoRefreshToken(REFRESH_INTERVAL);
  }
  setIsInitialised(true);
}

function refreshTokensOnFocus() {
  // When the focus on the window is back, if we are authenticated
  // we want to refresh the session tokens, so the user can still add
  // items to cart even after a period of inactivity.
  // We do this only if the last update was less than the value
  // (in minutes) set in REFRESH_TOKEN_IF_LESS_THAN_MINUTES
  const userTokens = authService.getPersistentTokens();
  if (!userTokens) return;

  const currentTime = new Date().getTime() / 1000;
  const tokenData = decodeJWT(userTokens.access_token);
  const minutesRemaining = (tokenData.exp - currentTime) / 60;
  if (minutesRemaining < REFRESH_TOKEN_IF_LESS_THAN_MINUTES) {
    refreshToken();
  }
}

export function onAuthenticationSuccess() {
  requests.setCommonHeaders({
    ...requests.commonHeaders,
    ...generateAuthHeaders(),
  });
}

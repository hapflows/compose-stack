"use client";

import { Button } from "@compose-stack-ui/ui";
import { useLogout } from "../../hooks/useLogout";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button onClick={logout} variant="neutral-outline">
      Logout
    </Button>
  );
}

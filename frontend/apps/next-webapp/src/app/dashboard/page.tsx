"use client";

import { redirect } from "next/navigation";

import { Text, Title } from "@compose-stack-ui/ui";

import { useAuthenticationSetup } from "@/apps/auth/hooks/useAuthenticationSetup";
import { useAuthenticationStore } from "@/apps/auth/store/authentication.store";
import { LogoutButton } from "@/apps/auth/components/logout-button/LogoutButton";
import { AuthenticatedMessage } from "@/apps/dashboard/components/authenticated-message/AuthenticatedMessage";

export default function Dashboard() {
  useAuthenticationSetup();

  const authenticationInitialised = useAuthenticationStore(
    (s) => s.isInitialised
  );
  const user = useAuthenticationStore((s) => s.user);

  if (!authenticationInitialised) return null;

  // If user is not set, redirect to login page
  if (!user) redirect("/login");

  return (
    <main>
      <div className="full-page-content p-20">
        <Title className="m-y-20">Dashboard</Title>
        <Text>
          This is the dashboard home page and will be protected, requiring user
          authentication.
        </Text>
        <div className="flex-spacebetween-center">
          <LogoutButton />
          <AuthenticatedMessage />
        </div>
      </div>
    </main>
  );
}

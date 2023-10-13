import { redirect } from "next/navigation";

import { Text, Title } from "@compose-stack-ui/ui";

export default function Dashboard() {
  const user = null;

  if (!user) redirect("/login");
  return (
    <main>
      <div className="full-page-content p-20">
        <Title className="m-y-20">Dashboard</Title>
        <Text>
          This is the dashboard home page and will be protected, requiring user
          authentication.
        </Text>
      </div>
    </main>
  );
}

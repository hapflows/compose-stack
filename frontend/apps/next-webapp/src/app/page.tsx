import Link from "next/link";

import { Button, Text, Title } from "@compose-stack-ui/ui";

export default function Home() {
  return (
    <main>
      <div className="full-page-content p-20">
        <Title className="m-y-20">Home page</Title>
        <Text>This is the webapp home page.</Text>
        <div className="flex-center-center">
          <Link href="/dashboard">
            <Button variant="primary">View Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

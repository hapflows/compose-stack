import { Text, Title } from "@compose-stack-ui/ui";

export default function Home() {
  return (
    <main>
      <div className="full-page-content p-20">
        <Title className="m-y-20">Home page</Title>
        <Text>
          This is the webapp home page that uses components from the UI library.
        </Text>
      </div>
    </main>
  );
}

import { Box } from "@compose-stack-ui/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("render: Authentication Layout");
  return (
    <div>
      <Box header="Authentication Layout">{children}</Box>
    </div>
  );
}

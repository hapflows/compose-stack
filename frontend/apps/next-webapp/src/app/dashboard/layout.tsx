import { Box } from "@compose-stack-ui/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Box header="Dashboard Layout">{children}</Box>
    </div>
  );
}

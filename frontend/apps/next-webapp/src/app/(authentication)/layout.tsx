export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-center-center full-page-content">
      <div>{children}</div>
    </div>
  );
}

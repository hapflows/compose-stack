import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div>The login form will be here.</div>
      <div>
        Not registered? <Link href="/register">Register here.</Link>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div>The registration form will be here.</div>
      <div>
        Already registered? <Link href="/login">Login here.</Link>
      </div>
    </div>
  );
}

import { Link } from "@/components/link/Link";
import { LoginForm } from "@/apps/auth/components/login-form/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <div className="m-t-20">
        Not registered? <Link href="/register">Register here.</Link>
      </div>
      <div className="m-t-20">
        Forgot Password? <Link href="/forgot-password">Recover it here.</Link>
      </div>
    </div>
  );
}

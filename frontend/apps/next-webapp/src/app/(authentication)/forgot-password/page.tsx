import Link from "next/link";

import { ForgotPasswordWizard } from "@/apps/auth/components/forgot-password-wizard/ForgotPasswordWizard";

export default function ForgotPasswordPage() {
  return (
    <div>
      <ForgotPasswordWizard />
      <div className="m-t-20">
        Not registered? <Link href="/register">Register here.</Link>
      </div>
    </div>
  );
}

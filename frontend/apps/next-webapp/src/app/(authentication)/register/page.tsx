import { Link } from "@/components/link/Link";
import { RegisterWizard } from "@/apps/auth/components/register-wizard/RegisterWizard";

export default function Page() {
  return (
    <div>
      <RegisterWizard />
      <div className="m-t-20">
        Already registered? <Link href="/login">Login here.</Link>
      </div>
    </div>
  );
}

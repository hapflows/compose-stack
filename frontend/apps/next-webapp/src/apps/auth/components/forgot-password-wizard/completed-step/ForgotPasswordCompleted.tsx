import { Box, Button } from "@compose-stack-ui/ui";

import { ForgotPasswordCompletedProps } from "./ForgotPasswordCompleted.types";

export function ForgotPasswordCompleted({
  onComplete,
}: ForgotPasswordCompletedProps) {
  return (
    <div>
      <Box variant="info" showIcon={true} header="Reset link sent">
        Your password reset link has been sent to the email you provided.
        <br />
        Check your email inbox and the spam folder.
      </Box>
      <div className="flex-end-center">
        <Button
          variant="positive"
          className="w-100pc m-t-20"
          onClick={onComplete}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

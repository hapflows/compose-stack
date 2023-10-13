import { Box, Button } from "@compose-stack-ui/ui";

import { ResetPasswordCompletedProps } from "./ResetPasswordCompleted.types";

export function ResetPasswordCompleted({
  onComplete,
}: ResetPasswordCompletedProps) {
  return (
    <div>
      <Box
        variant="info"
        className="m-b-20"
        showIcon={true}
        header="Reset Successful"
      >
        Your password has been reset successfully.
        <br />
        You can now login with the new password.
      </Box>
      <div className="flex-end-center">
        <Button onClick={onComplete} variant="positive">
          Continue
        </Button>
      </div>
    </div>
  );
}

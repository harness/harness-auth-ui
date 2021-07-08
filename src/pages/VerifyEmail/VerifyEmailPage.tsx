import React from "react";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useQueryParams } from "hooks/useQueryParams";
import VerifyEmailStatus, { VERIFY_EMAIL_STATUS } from "./VerifyEmailStatus";

const VerifyEmailPage = (): React.ReactElement => {
  const { status, email } = useQueryParams<{
    status: VERIFY_EMAIL_STATUS;
    email?: string;
  }>();
  return (
    <BasicLayout>
      <VerifyEmailStatus status={status} email={email} />
    </BasicLayout>
  );
};

export default VerifyEmailPage;

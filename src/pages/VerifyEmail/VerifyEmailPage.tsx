import React from "react";
import BasicLayout from "components/BasicLayout/BasicLayout";
import VerifyEmailStatus, { VERIFY_EMAIL_STATUS } from "./VerifyEmailStatus";

interface VerifyEmailStatusProps {
  email?: string;
  status: VERIFY_EMAIL_STATUS;
}

const VerifyEmailPage = ({
  props
}: {
  props: VerifyEmailStatusProps;
}): React.ReactElement => {
  return (
    <BasicLayout>
      <VerifyEmailStatus {...props} />
    </BasicLayout>
  );
};

export default VerifyEmailPage;

/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import { useQueryParams } from "hooks/useQueryParams";
import VerifyEmailStatus, {
  VERIFY_EMAIL_STATUS
} from "pages/VerifyEmail/VerifyEmailStatus";
import BasicLayoutExperimental from "../BasicLayout/BasicLayoutExperimental";
import css from "../../SignUp.module.css";

const EmailVerifyPage = (): React.ReactElement => {
  const { status, email } = useQueryParams<{
    status?: VERIFY_EMAIL_STATUS;
    email?: string;
  }>();
  return (
    <BasicLayoutExperimental>
      <VerifyEmailStatus
        status={status}
        email={decodeURIComponent(email || "")}
        className={css.emailVerify}
      />
    </BasicLayoutExperimental>
  );
};

export default EmailVerifyPage;

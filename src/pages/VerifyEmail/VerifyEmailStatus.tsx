/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import logo from "static/images/harness-logo.svg";
import cx from "classnames";
import { EMAIL_VERIFY_STATUS } from "utils/StringUtils";
import Text from "components/Text/Text";
import css from "./VerifyEmailStatus.module.css";
import { handleError } from "utils/ErrorUtils";
import { useResendVerifyEmail } from "services/ng";
import toast from "react-hot-toast";
import telemetry from "telemetry/Telemetry";
import { EVENT, CATEGORY } from "utils/TelemetryUtils";

interface VerifyEmailStatusProps {
  email?: string;
  status?: VERIFY_EMAIL_STATUS;
  className?: string;
}

export enum VERIFY_EMAIL_STATUS {
  EMAIL_SENT = "EMAIL_SENT",
  SIGNED_UP = "SIGNED_UP"
}

const harnessLogo = (
  <img
    src={logo}
    width={120}
    className={css.marginBottomHuge}
    alt={"Harness"}
  />
);

interface ResendButtonProps {
  email: string;
}

const ResendButton = (props: ResendButtonProps): React.ReactElement => {
  const { email } = props;

  const { mutate: resendVerifyEmail, loading } = useResendVerifyEmail({
    queryParams: { email }
  });

  async function handleResendVerifyEmail() {
    try {
      telemetry.track({
        event: EVENT.RESEND_VERIFY_EMAIL,
        properties: {
          category: CATEGORY.SIGNUP,
          userId: email
        }
      });
      await resendVerifyEmail();
      toast("Successfully resent the verification email");
    } catch (err: any) {
      handleError(err);
    }
  }

  return (
    <button
      disabled={loading}
      className={cx("button", "primary", css.resendButton)}
      onClick={handleResendVerifyEmail}
    >
      <Text>Resend verification email</Text>
    </button>
  );
};

const VerifyEmailSent = ({
  email,
  className
}: {
  email?: string;
  className?: string;
}): React.ReactElement => {
  const resendButton = email && <ResendButton email={email} />;

  return (
    <div className={className}>
      {harnessLogo}
      <Text className={cx(css.title, css.marginBottomLarge)}>
        {EMAIL_VERIFY_STATUS.EMAIL_SENT}
      </Text>
      <Text
        className={cx(
          css.inlineBlock,
          css.marginBottomLarge,
          css.lineHeight1dot5
        )}
      >
        Verification email sent to <b>{email}</b>. Please follow the link to
        verify your email.
      </Text>
      <Text className={cx(css.marginBottomXSmall, css.fontSmall)}>
        Didn’t receive it?
      </Text>
      {resendButton}
    </div>
  );
};

const EmailSignedUp = ({
  email,
  className
}: {
  email?: string;
  className?: string;
}): React.ReactElement => {
  const resendButton = email && <ResendButton email={email} />;
  return (
    <div className={className}>
      {harnessLogo}
      <Text className={cx(css.title, css.marginBottomLarge)}>
        {EMAIL_VERIFY_STATUS.ALREADY_SIGNED_UP}
      </Text>
      <Text
        className={cx(
          css.inlineBlock,
          css.marginBottomLarge,
          css.lineHeight1dot5
        )}
      >
        Verification email sent to <b>{email}</b>. Verify your email to start
        enjoying Harness.
      </Text>
      <Text className={cx(css.marginBottomXSmall, css.fontSmall)}>
        Didn’t receive it?
      </Text>
      {resendButton}
    </div>
  );
};

const VerifyEmailStatus = ({
  email,
  status,
  className
}: VerifyEmailStatusProps): React.ReactElement => {
  switch (status) {
    case VERIFY_EMAIL_STATUS.EMAIL_SENT:
      return <VerifyEmailSent email={email} className={className} />;
    case VERIFY_EMAIL_STATUS.SIGNED_UP:
      return <EmailSignedUp email={email} className={className} />;
    default:
      return <VerifyEmailSent email={email} className={className} />;
  }
};

export default VerifyEmailStatus;

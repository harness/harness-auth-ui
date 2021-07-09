import React from "react";
import logo from "static/images/harness-logo.svg";
import Spinner from "static/icons/spinner/Spinner";
import cx from "classnames";
import { EMAIL_VERIFY_STATUS } from "utils/StringUtils";
import Text from "components/Text/Text";
import css from "./VerifyEmailStatus.module.css";

interface VerifyEmailStatusProps {
  email?: string;
  status: VERIFY_EMAIL_STATUS;
}

export enum VERIFY_EMAIL_STATUS {
  IN_PROGRESS = "IN_PROGRESS",
  EMAIL_SENT = "EMAIL_SENT",
  SIGNED_UP = "SIGNED_UP",
  VERIFY_FAILED = "VERIFY_FAILED",
  VERIFY_SUCCESS = "VERIFY_SUCCESS"
}

const harnessLogo = (
  <img
    src={logo}
    width={120}
    className={css.marginBottomHuge}
    alt={"Harness"}
  />
);

const resendBtn = (
  <input
    type="button"
    value="Resend Verification Email"
    className="button primary"
  />
);

const VerifyInProgress = (): React.ReactElement => {
  return (
    <div>
      {harnessLogo}
      <Spinner className={cx(css.spinner, css.marginBottomLarge)} />
      <Text className={css.title}>{EMAIL_VERIFY_STATUS.IN_PROGRESS}</Text>
    </div>
  );
};

const VerifySuccess = (): React.ReactElement => {
  return (
    <div>
      {harnessLogo}
      <Text className={css.title}>{EMAIL_VERIFY_STATUS.SUCCESS}</Text>
    </div>
  );
};

const VerifyEmailSent = ({ email }: { email?: string }): React.ReactElement => {
  return (
    <div>
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
        Verification Email sent to <b>{email}</b>. Please follow the link to
        verify your email.
      </Text>
      <Text className={cx(css.marginBottomXSmall, css.fontSmall)}>
        Didn’t receive it?
      </Text>
      {resendBtn}
    </div>
  );
};

const EmailSignedUp = ({ email }: { email?: string }): React.ReactElement => {
  return (
    <div>
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
        Verification Email sent to <b>{email}</b>. Verify your email to start
        enjoying Harness.
      </Text>
      <Text className={cx(css.marginBottomXSmall, css.fontSmall)}>
        Didn’t receive it?
      </Text>
      {resendBtn}
    </div>
  );
};

const VerifyFailed = (): React.ReactElement => {
  return (
    <div>
      {harnessLogo}

      <Text
        icon="warningSign"
        iconProps={{ size: 28 }}
        className={cx(css.title, css.marginBottomLarge)}
      >
        {EMAIL_VERIFY_STATUS.FAILED}
      </Text>

      <Text className={cx(css.marginBottomLarge, css.lineHeight1dot5)}>
        Your Email verification wasn’t successful. Please verify the Email
        again.
      </Text>
      {resendBtn}
    </div>
  );
};

const VerifyEmailStatus = ({
  email,
  status
}: VerifyEmailStatusProps): React.ReactElement => {
  switch (status) {
    case VERIFY_EMAIL_STATUS.IN_PROGRESS:
      return <VerifyInProgress />;
    case VERIFY_EMAIL_STATUS.EMAIL_SENT:
      return <VerifyEmailSent email={email} />;
    case VERIFY_EMAIL_STATUS.SIGNED_UP:
      return <EmailSignedUp email={email} />;
    case VERIFY_EMAIL_STATUS.VERIFY_FAILED:
      return <VerifyFailed />;
    case VERIFY_EMAIL_STATUS.VERIFY_SUCCESS:
      return <VerifySuccess />;
  }
};

export default VerifyEmailStatus;

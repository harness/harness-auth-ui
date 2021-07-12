import React from "react";
import logo from "static/images/harness-logo.svg";
import cx from "classnames";
import { EMAIL_VERIFY_STATUS } from "utils/StringUtils";
import Text from "components/Text/Text";
import css from "./VerifyEmailStatus.module.css";
import { handleError } from "utils/ErrorUtils";
import { useResendVerifyEmail } from "services/ng";
import toast from "react-hot-toast";

interface VerifyEmailStatusProps {
  email?: string;
  status?: VERIFY_EMAIL_STATUS;
}

export enum VERIFY_EMAIL_STATUS {
  IN_PROGRESS = "IN_PROGRESS",
  EMAIL_SENT = "EMAIL_SENT",
  SIGNED_UP = "SIGNED_UP",
  VERIFY_FAILED = "VERIFY_FAILED"
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

  const { mutate: resendVerifyEmail, loading, error } = useResendVerifyEmail({
    queryParams: { email }
  });

  async function handleResendVerifyEmail() {
    await resendVerifyEmail();

    toast("Successfully resent the verification email");
  }

  if (error) {
    handleError(error);
  }

  return (
    <button
      disabled={loading}
      className={cx("button", "primary", css.resendButton)}
      onClick={handleResendVerifyEmail}
    >
      <Text>Resend Verification Email</Text>
    </button>
  );
};

const VerifyEmailSent = ({ email }: { email?: string }): React.ReactElement => {
  const resendButton = email && <ResendButton email={email} />;

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

const EmailSignedUp = ({ email }: { email?: string }): React.ReactElement => {
  const resendButton = email && <ResendButton email={email} />;
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
  status
}: VerifyEmailStatusProps): React.ReactElement => {
  switch (status) {
    case VERIFY_EMAIL_STATUS.EMAIL_SENT:
      return <VerifyEmailSent email={email} />;
    case VERIFY_EMAIL_STATUS.SIGNED_UP:
      return <EmailSignedUp email={email} />;
    default:
      return <VerifyEmailSent email={email} />;
  }
};

export default VerifyEmailStatus;

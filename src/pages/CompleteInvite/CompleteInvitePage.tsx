import React, { useEffect } from "react";
import logo from "static/images/harness-logo.svg";
import Spinner from "static/icons/spinner/Spinner";
import { useParams } from "react-router-dom";
import BasicLayout from "components/BasicLayout/BasicLayout";
import cx from "classnames";
import { EMAIL_VERIFY_STATUS } from "utils/StringUtils";
import { handleSignUpSuccess } from "utils/SignUpUtils";
import { handleError } from "utils/ErrorUtils";
import Text from "components/Text/Text";
import {
  useCompleteSignupInvite,
  useResendVerifyEmail,
  CompleteSignupInvitePathParams,
  UserInfo
} from "services/ng";
import toast from "react-hot-toast";
import css from "./CompleteInvitePage.module.css";

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

interface EmailVerificationFailedProps {
  email: string | null;
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
      <Text>Resend verification email</Text>
    </button>
  );
};

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

const VerifyFailed = (
  props: EmailVerificationFailedProps
): React.ReactElement => {
  const { email } = props;

  const resendButton = email && <ResendButton email={email} />;

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
      {resendButton}
    </div>
  );
};

const CompleteInvitePage = (): React.ReactElement => {
  const { token } = useParams<CompleteSignupInvitePathParams>();
  const {
    mutate: completeSignupInvite,
    loading,
    error
  } = useCompleteSignupInvite({
    token: token,
    requestOptions: { headers: { "content-type": "application/json" } }
  });

  function getEmailFromUrlSearchParam(): string | null {
    const queryString = window.location.hash?.split("?")?.[1];
    const urlParams = new URLSearchParams(queryString);
    return urlParams?.get("email");
  }

  async function handleCompleteSignup(): Promise<void> {
    try {
      const response = await completeSignupInvite();
      const userInfo: UserInfo | undefined = response?.resource;

      if (userInfo) {
        handleSignUpSuccess(userInfo);
      } else {
        handleError("Something went wrong. Please try again.");
      }
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    handleCompleteSignup();
  }, []);

  function getInnerComponent() {
    if (loading) {
      return <VerifyInProgress />;
    } else if (error) {
      return <VerifyFailed email={getEmailFromUrlSearchParam()} />;
    } else {
      return <VerifySuccess />;
    }
  }

  return <BasicLayout>{getInnerComponent()}</BasicLayout>;
};

export default CompleteInvitePage;

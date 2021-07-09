import React, { useEffect, useState } from "react";
import { UserInfo } from "services/ng/index";
import {
  useCompleteSignupInvite,
  CompleteSignupInvitePathParams
} from "services/ng";
import { useParams } from "react-router-dom";
import { handleError } from "utils/ErrorUtils";
import { EMAIL_VERIFY_STATUS } from "utils/StringUtils";
import { handleSignUpSuccess } from "utils/SignUpUtils";

export const VerifyEmail: React.FC = () => {
  const { token } = useParams<CompleteSignupInvitePathParams>();
  const { mutate: completeSignupInvite, loading } = useCompleteSignupInvite({
    token: token,
    requestOptions: { headers: { "content-type": "application/json" } }
  });

  const [msg, setMsg] = useState<EMAIL_VERIFY_STATUS>(
    EMAIL_VERIFY_STATUS.IN_PROGRESS
  );

  const handleVerifyToken = async (): Promise<void> => {
    try {
      const response = await completeSignupInvite();
      const userInfo: UserInfo | undefined = response?.resource;

      if (userInfo) {
        handleSignUpSuccess(userInfo);
      } else {
        handleError(
          "Looks like something went wrong. Can you try to verify your email again?"
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    handleVerifyToken()
      .then(() => {
        if (isMounted) {
          setMsg(EMAIL_VERIFY_STATUS.SUCCESS);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMsg(EMAIL_VERIFY_STATUS.FAILED);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setMsg(EMAIL_VERIFY_STATUS.IN_PROGRESS);
  }, [loading]);

  return <div>{msg}</div>;
};

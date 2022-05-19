/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import { useSignup, SignupDTO } from "services/ng";
import RouteDefinitions from "RouteDefinitions";
import { handleError } from "utils/ErrorUtils";
import telemetry from "telemetry/Telemetry";
import { useQueryParams } from "hooks/useQueryParams";
import { VERIFY_EMAIL_STATUS } from "pages/VerifyEmail/VerifyEmailStatus";
import { BillingFrequency, Edition, SignupAction } from "utils/SignUpUtils";
import { CATEGORY, PAGE, EVENT } from "utils/TelemetryUtils";
import css from "../SignUp.module.css";
import SignupFormWithCredentials from "./SignupFormWithCredentials";
import SignupFormOAuth from "./SignupFormOAuth";
import BasicLayoutExperimental from "./BasicLayout/BasicLayoutExperimental";
import { getModuleDetails } from "./utils";

interface SignUpFormData {
  email: string;
  password: string;
}
export enum SIGNUPFORM_TYPES {
  OAUTH_FORM = "OAUTH_FORM",
  CREDENTIAL_FORM = "CREDENTIAL_FORM"
}
const SignUpExperimental: React.FC = () => {
  const [formType, setFormType] = useState<SIGNUPFORM_TYPES>(
    SIGNUPFORM_TYPES.OAUTH_FORM
  );
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const history = useHistory();
  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const { mutate: signup, loading } = useSignup({});
  const captchaRef = useRef<ReCAPTCHA>(null);
  const {
    module,
    signupAction,
    edition,
    billingFrequency,
    utm_source,
    utm_content,
    utm_medium,
    utm_term,
    utm_campaign
  } = useQueryParams<{
    module?: string;
    signupAction?: string;
    edition?: string;
    billingFrequency?: string;
    utm_source?: string;
    utm_content?: string;
    utm_medium?: string;
    utm_term?: string;
    utm_campaign?: string;
  }>();

  const moduleDetails = getModuleDetails(module as string);

  const [captchaExecuting, setCaptchaExecuting] = useState(false);
  useEffect(() => {
    const { email, password } = signupData;

    if (email && password && captchaToken) {
      setCaptchaExecuting(false);
      handleSignup(signupData, captchaToken);
    }
  }, [captchaToken]);

  const handleSignup = async (
    data: SignUpFormData,
    captchaToken: string
  ): Promise<void> => {
    const encodedEmail = encodeURIComponent(data.email);
    try {
      const signupRequestData: SignupDTO = {
        ...data,
        intent: module,
        utmInfo: {
          utmSource: utm_source,
          utmContent: utm_content,
          utmMedium: utm_medium,
          utmTerm: utm_term,
          utmCampaign: utm_campaign
        }
      };

      if (signupAction && signupAction.toUpperCase() in SignupAction) {
        signupRequestData.signupAction = signupAction.toUpperCase() as SignupAction;
      }

      if (edition && edition.toUpperCase() in Edition) {
        signupRequestData.edition = edition.toUpperCase() as Edition;
      }

      if (
        billingFrequency &&
        billingFrequency.toUpperCase() in BillingFrequency
      ) {
        signupRequestData.billingFrequency = billingFrequency.toUpperCase() as BillingFrequency;
      }

      await signup(signupRequestData, {
        queryParams: { captchaToken: captchaToken }
      });

      history.push({
        pathname: RouteDefinitions.toEmailVerification(),
        search: `?status=${VERIFY_EMAIL_STATUS.EMAIL_SENT}&email=${encodedEmail}`
      });
    } catch (error) {
      captchaRef.current?.reset();

      if (
        error?.data?.responseMessages?.length &&
        error?.data?.responseMessages[0]?.code === "USER_ALREADY_REGISTERED"
      ) {
        history.push({
          pathname: RouteDefinitions.toEmailVerification(),
          search: `?status=${VERIFY_EMAIL_STATUS.SIGNED_UP}&email=${encodedEmail}`
        });
      } else {
        handleError(error);
      }
    }
  };

  const manuallyExcecuteRecaptcha = (): boolean => {
    if (captchaRef.current?.execute) {
      captchaRef.current.execute();
      setCaptchaExecuting(true);
      return true;
    }

    handleError("Captcha failed to execute");
    return false;
  };

  const onSubmit = (data: SignUpFormData) => {
    if (manuallyExcecuteRecaptcha()) {
      data.email = data.email.toLowerCase();
      setSignupData(data);
      telemetry.track({
        event: EVENT.SIGNUP_SUBMIT,
        properties: {
          intent: module || "",
          category: CATEGORY.SIGNUP,
          userId: data.email,
          groupId: data.email,
          utm_source: utm_source || "",
          utm_medium: utm_medium || "",
          utm_campaign: utm_campaign || "",
          utm_term: utm_term || "",
          utm_content: utm_content || ""
        }
      });
    }
  };

  useEffect(() => {
    telemetry.page({
      name: PAGE.SIGNUP_PAGE,
      category: CATEGORY.SIGNUP,
      properties: {
        intent: module || "",
        utm_source: utm_source || "",
        utm_medium: utm_medium || "",
        utm_campaign: utm_campaign || "",
        utm_term: utm_term || "",
        utm_content: utm_content || ""
      }
    });
  }, []);

  function handleRecaptchaError() {
    // Block the user until they refresh
    setCaptchaExecuting(true);
    handleError("Captcha has failed, please refresh the page.");
  }

  return (
    <BasicLayoutExperimental>
      <div className={cx(css.signup, css.experimentSignup)}>
        {/* <div className={css.header}>
          <img src={logo} width={120} className={css.logo} />
        </div> */}
        <div className={css.title}>Sign up</div>
        <div className={css.subtitle}>
          Get started for free. No Credit card required.
        </div>
        {formType === SIGNUPFORM_TYPES.OAUTH_FORM ? (
          <SignupFormOAuth
            changeFormType={() => setFormType(SIGNUPFORM_TYPES.CREDENTIAL_FORM)}
          />
        ) : (
          <SignupFormWithCredentials
            onSubmit={onSubmit}
            loading={loading}
            captchaExecuting={captchaExecuting}
            setCaptchaToken={setCaptchaToken}
            handleRecaptchaError={handleRecaptchaError}
            captchaRef={captchaRef}
          />
        )}
        <p className={css.agreement}>
          By signing up, you agree to our
          <a href="" className={css.link}>
            Privacy Policy
          </a>
          and our
          <a href="" className={css.link}>
            Terms of Use
          </a>
        </p>
      </div>
      <img src={moduleDetails.pathImg} className={css.imagecd} />
    </BasicLayoutExperimental>
  );
};

export default SignUpExperimental;

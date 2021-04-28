import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";

import BasicLayout from "components/BasicLayout/BasicLayout";
import { useSignup } from "services/ng";

import logo from "static/images/harness-logo.svg";
import css from "./SignUp.module.css";
import AuthFooter, { AuthPage } from "components/AuthFooter/AuthFooter";
import { handleError } from "utils/ErrorUtils";
import { handleSignUpSuccess } from "utils/SignUpUtils";
import Recaptcha from "react-recaptcha";

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const { mutate: signup, loading } = useSignup({});
  const captchaRef = useRef<Recaptcha>(null);

  useEffect(() => {
    const { email, password } = signupData;

    if (email && password && captchaToken) {
      handleSignup(signupData, captchaToken);
    }
  }, [captchaToken]);

  const handleSignup = async (
    data: SignUpFormData,
    captchaToken: string
  ): Promise<void> => {
    const { email, password } = data;

    const signupData: SignUpFormData = {
      email,
      password
    };

    try {
      const userInfo = await signup(signupData, {
        queryParams: { captchaToken: captchaToken }
      });
      handleSignUpSuccess(userInfo.resource);
    } catch (error) {
      captchaRef.current?.reset();

      handleError(error);
    }
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const signupFormData = (Object.fromEntries(
      data.entries()
    ) as unknown) as SignUpFormData;
    if (signupFormData.email.length > 0 && signupFormData.password.length > 0) {
      captchaRef.current?.execute();
      setSignupData(signupFormData);
    }
  };

  return (
    <BasicLayout>
      <div className={cx(css.signup)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} />
        </div>
        <div className={css.title}>Sign Up</div>
        <div className={css.subtitle}>and get ship done.</div>
        <form
          className="layout-vertical spacing-medium"
          onSubmit={handleSubmit}
        >
          <div className="layout-vertical spacing-small">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="email@work.com"
              disabled={loading}
            />
          </div>
          <div
            className="layout-vertical spacing-small"
            style={{ position: "relative" }}
          >
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              disabled={loading}
            />
          </div>
          <Recaptcha
            sitekey="6LdLgLwaAAAAAJ3MyiYcxGeUSNqkJDq-_gDIVU66"
            size="invisible"
            ref={captchaRef}
            verifyCallback={(captchaToken: string) => {
              setCaptchaToken(captchaToken);
            }}
          />
          <input
            type="submit"
            value="Sign Up"
            className="button primary"
            disabled={loading}
          />
        </form>
        <AuthFooter page={AuthPage.SignUp} />
      </div>
    </BasicLayout>
  );
};

export default SignUp;

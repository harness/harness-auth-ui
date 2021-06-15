import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import RouteDefinitions from "RouteDefinitions";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useResetPassword } from "services/portal";
import { regexEmail } from "utils/StringUtils";

import logo from "static/images/harness-logo.svg";
import css from "../SignIn/SignIn.module.css";
import Text from "components/Text/Text";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPassword() {
  const { mutate: resetPassword, loading } = useResetPassword({});

  const handleReset = async (data: ForgotPasswordFormData) => {
    try {
      const response = await resetPassword({
        email: data.email,
        isNG: true
      } as any); // FIXME: isNG is not supported by backend yet
      if (response.resource) {
        toast.success(
          "If your email address exists in our database, you will receive a password recovery link soon."
        );
      } else {
        // TODO: handle failure
      }
    } catch (err) {
      // TODO: handle error
    }
  };

  return (
    <BasicLayout>
      <div className={cx(css.signin)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} />
          <div style={{ flex: 1 }}></div>
          <Link to={RouteDefinitions.toSignIn()}>
            <Text icon="leftArrow">Sign In</Text>
          </Link>
        </div>
        <div className={css.title}>Forgot Password</div>
        <div className={css.subtitle}></div>
        <form
          className="layout-vertical spacing-medium"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target as HTMLFormElement);
            const loginFormData = (Object.fromEntries(
              data.entries()
            ) as unknown) as ForgotPasswordFormData;
            if (
              loginFormData.email.length > 0 &&
              regexEmail.test(loginFormData.email)
            ) {
              handleReset(loginFormData);
            } else {
              toast("Please enter a valid email ID");
            }
          }}
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
          <input
            type="submit"
            value="Reset Password"
            className="button primary"
            disabled={loading}
          />
        </form>
      </div>
    </BasicLayout>
  );
}

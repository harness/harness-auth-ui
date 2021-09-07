import React from "react";
import cx from "classnames";
import { Link, useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import SecureStorage from "utils/SecureStorage";

import RouteDefinitions from "RouteDefinitions";
import BasicLayout from "components/BasicLayout/BasicLayout";

import logo from "static/images/harness-logo.svg";
import Text from "components/Text/Text";

import { useTwoFactorLogin } from "services/portal";
import { formatJWTHeader, handleLoginSuccess } from "utils/LoginUtils";
import { handleError } from "utils/ErrorUtils";

import css from "../SignIn/SignIn.module.css";
import css2 from "./TwoFactorAuth.module.css";

interface TwoFactorAuthFormData {
  authCode: string;
}

const TwoFactorAuth: React.FC = () => {
  const accountId = SecureStorage.getItem("acctId") as string;
  const history = useHistory();
  const { mutate: login, loading } = useTwoFactorLogin({
    queryParams: {
      accountId,
      routingId: accountId // FIXME: swagger doesn't have this query param yet,
    } as any
  });

  const handleLogin = async (formData: TwoFactorAuthFormData) => {
    try {
      const response = await login(formatJWTHeader(formData.authCode));
      handleLoginSuccess({
        resource: response?.resource,
        history,
        selectedAccount: accountId
      });
    } catch (err) {
      if (err.status === 401) {
        toast("Invalid Authentication Code");
      } else {
        handleError(err);
      }
    }
  };

  return (
    <BasicLayout>
      <div className={cx(css.signin)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} />
          <div style={{ flex: 1 }}></div>
          <Link to={RouteDefinitions.toSignIn()}>
            <Text icon="leftArrow">Sign in</Text>
          </Link>
        </div>
        <div className={css.title}>Enter Authorization Code</div>
        <div className={css.subtitle}>and get ship done.</div>
        <form
          className="layout-vertical spacing-medium"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target as HTMLFormElement);
            const twoFactorAuthFormData = (Object.fromEntries(
              data.entries()
            ) as unknown) as TwoFactorAuthFormData;
            if (twoFactorAuthFormData.authCode?.length === 6) {
              handleLogin(twoFactorAuthFormData);
            }
          }}
        >
          <div className="layout-vertical spacing-small">
            <label htmlFor="email">Code</label>
            <input
              name="authCode"
              type="text"
              id="authCode"
              placeholder="6-digit code"
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <input
            type="submit"
            value="Continue"
            className="button primary"
            disabled={loading}
          />
        </form>
        <div className={css2.explainer}>
          If you’re a new Harness user, or your account has recently enabled Two
          Factor Authentication, check for an email containing your Two Factor
          Authentication secret.
        </div>
        <div className={css2.explainer}>
          If you don’t have a Two Factor Authentication secret, ask your Harness
          account administrator to provide one.
        </div>
        <div className={css.footer}>
          No account? <Link to={RouteDefinitions.toSignUp()}>Get Started</Link>
        </div>
      </div>
    </BasicLayout>
  );
};

export default TwoFactorAuth;

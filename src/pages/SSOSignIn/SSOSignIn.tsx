import React from "react";
import cx from "classnames";
import toast from "react-hot-toast";
import { Form } from "react-final-form";
import { Link } from "react-router-dom";

import { useGetLoginType } from "services/portal";
import RouteDefinitions from "RouteDefinitions";
import BasicLayout from "components/BasicLayout/BasicLayout";
import Field from "components/Field/Field";
import Text from "components/Text/Text";

import logo from "static/images/harness-logo.svg";
import css from "../SignIn/SignIn.module.css";
import { validateEmail } from "utils/FormValidationUtils";
import { getAccountIdFromUrl } from "utils/LoginUtils";

interface SSOFormData {
  email: string;
}

const SSOSignIn: React.FC = () => {
  const returnUrl = sessionStorage.getItem("returnUrl");
  const accountId = returnUrl ? getAccountIdFromUrl(returnUrl) : undefined;

  const { mutate: getLoginType, loading } = useGetLoginType({
    queryParams: { accountId }
  });

  const handleSSOInit = async (data: SSOFormData): Promise<void> => {
    try {
      const res = await getLoginType({ userName: data.email });
      if (res.resource?.authenticationMechanism === "SAML") {
        if (res.resource.ssorequest?.idpRedirectUrl) {
          window.location.href = res.resource.ssorequest?.idpRedirectUrl;
        }
      } else {
        toast("Single sign-on is not enabled for your account");
      }
    } catch (err) {
      toast("There was an error");
    }
  };

  return (
    <BasicLayout>
      <div className={cx(css.signin)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} alt={"Harness"} />
          <div style={{ flex: 1 }} />
          <Link to={RouteDefinitions.toSignIn()}>
            <Text icon="leftArrow">Main sign in</Text>
          </Link>
        </div>
        <div className={css.title}>
          Sign in with an <br />
          SSO identity provider
        </div>
        <div className={css.subtitle}>and get ship done.</div>
        <Form
          onSubmit={handleSSOInit}
          render={({ handleSubmit }) => {
            return (
              <form
                className="layout-vertical spacing-medium"
                onSubmit={handleSubmit}
              >
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="email@work.com"
                  disabled={loading}
                  validate={validateEmail}
                />
                <input
                  type="submit"
                  value="Sign in"
                  className="button primary"
                  disabled={loading}
                />
              </form>
            );
          }}
        />
      </div>
    </BasicLayout>
  );
};

export default SSOSignIn;

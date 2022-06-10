/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import cx from "classnames";
import { Form } from "react-final-form";
import { useSignup } from "services/portal";
import { Link, useHistory } from "react-router-dom";

import BasicLayout from "components/BasicLayout/BasicLayout";

import Field from "components/Field/Field";
import { handleError } from "utils/ErrorUtils";
import { validateEmail, validateString } from "utils/FormValidationUtils";
import PasswordField from "components/Field/PasswordField";
import { URLS } from "interfaces/OAuthProviders";
import Text from "components/Text/Text";
import RouteDefinitions from "RouteDefinitions";

import logo from "static/images/harness-logo.svg";
import css from "./SignUp.module.css";
import toast from "react-hot-toast";

interface SignUpFormData {
  email: string;
  password: string;
  accountName: string;
  companyName: string;
  firstname?: string;
  lastname?: string;
}

const SignUpOnPrem: React.FC = () => {
  const { mutate: signup, loading } = useSignup({ source: "ONPREM" });
  const history = useHistory();

  const handleSignup = async (formData: SignUpFormData): Promise<void> => {
    try {
      const payload = {
        ...formData,
        name: `${formData.firstname} ${formData.lastname}`
      };
      delete payload.firstname;
      delete payload.lastname;
      // `any` is required because BE is incorrectly using Invite class for signup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const signupResponse = await signup(payload as any);
      if (signupResponse) {
        toast.success("Account created successfully!");
        history.push(RouteDefinitions.toSignIn());
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onSubmit = (data: SignUpFormData) => {
    data.email = data.email.toLowerCase();
    handleSignup(data);
  };

  return (
    <BasicLayout>
      <div className={cx(css.signup)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} />
          <div style={{ flex: 1 }} />
          <Link to={RouteDefinitions.toSignIn()}>
            <Text icon="leftArrow">Sign in</Text>
          </Link>
        </div>
        <div className={css.title}>Welcome to Harness</div>
        <div className={css.communitySubtitle}>Set up an admin user</div>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form
              className="layout-vertical spacing-medium"
              onSubmit={handleSubmit}
            >
              <Field
                name="email"
                label={"Email"}
                placeholder="email@work.com"
                disabled={loading}
                validate={validateEmail}
              />
              <PasswordField
                name="password"
                label="Password"
                placeholder="Password"
                disabled={loading}
              />
              <Field
                name="accountName"
                label={"Account Name"}
                placeholder="Account"
                disabled={loading}
                validate={validateString}
              />
              <Field
                name="companyName"
                label={"Company Name"}
                placeholder="Company"
                disabled={loading}
                validate={validateString}
              />
              <Field
                name="firstname"
                label={"First Name"}
                placeholder="John"
                disabled={loading}
                validate={validateString}
              />
              <Field
                name="lastname"
                label={"Last Name"}
                placeholder="Smith"
                disabled={loading}
                validate={validateString}
              />
              <input
                type="submit"
                value={loading ? "Creating user..." : "Create user"}
                className="button primary"
                disabled={loading}
              />
            </form>
          )}
        />
        <div className={cx(css.disclaimer)}>
          By registering, you agree to our&nbsp;
          <a
            className={css.externalLink}
            href={URLS.PRIVACY_AGREEMENT}
            rel="noreferrer"
            target="_blank"
          >
            Privacy Policy&nbsp;
          </a>
          and our&nbsp;
          <a
            className={css.externalLink}
            href={URLS.SUBSCRIPTION_TERMS}
            rel="noreferrer"
            target="_blank"
          >
            Terms of Use.&nbsp;
          </a>
        </div>
      </div>
    </BasicLayout>
  );
};

export default SignUpOnPrem;

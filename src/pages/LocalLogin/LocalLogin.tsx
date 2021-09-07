import React from "react";
import cx from "classnames";
import { Link, useHistory } from "react-router-dom";
import { Form } from "react-final-form";

import RouteDefinitions from "RouteDefinitions";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useForceLoginUsingHarnessPassword } from "services/portal";
import { handleError } from "utils/ErrorUtils";
import Text from "components/Text/Text";
import { handleLoginSuccess } from "utils/LoginUtils";
import Field from "components/Field/Field";
import {
  validateEmail,
  validatePasswordRequiredOnly
} from "utils/FormValidationUtils";

import logo from "static/images/harness-logo.svg";
import css from "../SignIn/SignIn.module.css";

const createAuthToken = (email: string, password: string): string => {
  const encodedToken = btoa(email + ":" + password);
  return `Basic ${encodedToken}`;
};

interface LoginFormData {
  email: string;
  password: string;
}

const LocalLogin: React.FC = () => {
  const history = useHistory();
  const { mutate: login, loading } = useForceLoginUsingHarnessPassword({});

  const handleLogin = async (formData: LoginFormData) => {
    try {
      const response = await login({
        authorization: createAuthToken(formData.email, formData.password)
      });
      handleLoginSuccess({ resource: response?.resource, history });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <BasicLayout>
      <div className={cx(css.signin)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} alt={"Harness"} />
          <div style={{ flex: 1 }} />
          <Link to={RouteDefinitions.toSignIn()}>
            <Text icon="leftArrow">Main Sign in</Text>
          </Link>
        </div>
        <div className={css.title}>Local Login</div>
        <div className={css.subtitle} />
        <Form
          onSubmit={handleLogin}
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
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  disabled={loading}
                  validate={validatePasswordRequiredOnly}
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

export default LocalLogin;

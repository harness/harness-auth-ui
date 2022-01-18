/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import cx from "classnames";
import { Form } from "react-final-form";
import { Link, useHistory, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import RouteDefinitions from "RouteDefinitions";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useUpdatePassword } from "services/portal";

import logo from "static/images/harness-logo.svg";
import css from "../SignIn/SignIn.module.css";
import Text from "components/Text/Text";
import { handleError } from "utils/ErrorUtils";
import { validatePassword } from "utils/FormValidationUtils";
import PasswordField from "components/Field/PasswordField";

interface UpdatePasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordParams {
  token: string;
}

export default function ResetPassword() {
  const history = useHistory();
  const { token } = useParams<ResetPasswordParams>();
  const { mutate: updatePassword, loading } = useUpdatePassword({ token });

  const handleReset = async (data: UpdatePasswordFormData) => {
    try {
      const response = await updatePassword({ password: data.password });
      if (response.resource) {
        toast("Your password has been changed");
        setTimeout(() => {
          history.push(RouteDefinitions.toSignIn());
        }, 2000);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ) => {
    const returnMessage = validatePassword(confirmPassword);
    if (returnMessage) {
      return returnMessage;
    }

    if (password !== confirmPassword) {
      return "Your password and confirmation password do not match";
    }
  };

  return (
    <BasicLayout>
      <div className={cx(css.signin)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} alt={"Harness"} />
          <div style={{ flex: 1 }} />
          <Link to={RouteDefinitions.toSignIn()}>
            <Text icon="leftArrow">Sign in</Text>
          </Link>
        </div>
        <div className={css.title}>Reset password</div>
        <div className={css.subtitle} />
        <Form
          onSubmit={handleReset}
          render={({ handleSubmit, values }) => {
            return (
              <form
                className="layout-vertical spacing-medium"
                onSubmit={handleSubmit}
              >
                <PasswordField
                  name="password"
                  label="Password"
                  disabled={loading}
                  validate={validatePassword}
                />
                <PasswordField
                  name="confirmPassword"
                  label="Confirm password"
                  disabled={loading}
                  validate={(confirmPassword: string) =>
                    validateConfirmPassword(confirmPassword, values.password)
                  }
                />
                <input
                  type="submit"
                  value="Reset password"
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
}

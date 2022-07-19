/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";
import { Form } from "react-final-form";
import toast from "react-hot-toast";

import RouteDefinitions from "RouteDefinitions";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useResetPassword } from "services/portal";
import Field from "components/Field/Field";

import logo from "static/images/harness-logo.svg";
import css from "../SignIn/SignIn.module.css";
import Text from "components/Text/Text";
import { validateEmail } from "utils/FormValidationUtils";
import { handleError } from "utils/ErrorUtils";

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
          "An email has been sent to you with a link to reset your password"
        );
      } else {
        handleError(response);
      }
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    console.log(loading.x.y);
  }, []);

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
        <div className={css.title}>Forgot password</div>
        <div className={css.subtitle} />
        <Form
          onSubmit={handleReset}
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

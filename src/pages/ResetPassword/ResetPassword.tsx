import React from "react";
import cx from "classnames";
import { Form } from "react-final-form";
import { Link, useHistory, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import RouteDefinitions from "RouteDefinitions";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useUpdatePassword } from "services/portal";
import Field from "components/Field/Field";

import logo from "static/images/harness-logo.svg";
import css from "../SignIn/SignIn.module.css";
import Text from "components/Text/Text";
import { handleError } from "utils/ErrorUtils";
import { validatePasswordRequiredOnly } from "utils/FormValidationUtils";

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
    if (data.password != data.confirmPassword) {
      toast("Passwords do not match");
      return;
    }

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

  return (
    <BasicLayout>
      <div className={cx(css.signin)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} alt={"Harness"} />
          <div style={{ flex: 1 }} />
          <Link to={RouteDefinitions.toSignIn()}>
            <Text icon="leftArrow">Sign In</Text>
          </Link>
        </div>
        <div className={css.title}>Reset Password</div>
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
                  name="password"
                  type="password"
                  label="Password"
                  disabled={loading}
                  validate={validatePasswordRequiredOnly}
                />
                <Field
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  disabled={loading}
                  validate={validatePasswordRequiredOnly}
                />
                <input
                  type="submit"
                  value="Reset Password"
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

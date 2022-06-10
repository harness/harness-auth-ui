/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { FocusEvent } from "react";
import cx from "classnames";

import { Field as FinalField } from "react-final-form";

import { validateEmail, validatePassword } from "utils/FormValidationUtils";

import css from "./Field.module.css";

type validate = typeof validateEmail | typeof validatePassword;

interface FieldProps {
  name: string;
  label?: string;
  validate?: validate;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  initialValue?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  infoMessage?: string;
}

const Field: React.FC<FieldProps> = (props) => {
  const {
    name,
    label,
    validate,
    disabled,
    placeholder,
    type,
    onBlur,
    initialValue,
    infoMessage
  } = props;

  return (
    <FinalField name={name} validate={validate} initialValue={initialValue}>
      {({ input, meta }) => {
        const showError = meta.error && meta.touched;

        return (
          <div className={cx("layout-vertical spacing-small", css.field)}>
            {label && <label>{label}</label>}
            <input
              {...input}
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={cx(showError && css["validation-outline"])}
              onBlur={onBlur}
            />
            {showError && (
              <span className={cx(css["validation-message"])}>
                {meta.error}
              </span>
            )}
            {infoMessage && type === "password" && !showError && (
              <span className={cx(css["info-message"])}>{infoMessage}</span>
            )}
          </div>
        );
      }}
    </FinalField>
  );
};

export default Field;

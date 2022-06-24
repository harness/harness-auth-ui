/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import cx from "classnames";
import css from "../SignUp.module.css";
interface ButtonProps {
  text: string;
  icon?: string;
  iconClassName?: string;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "submit" | "reset" | "button";
}
export default function LargeOAuthButton({
  text,
  icon,
  iconClassName,
  className,
  onClick,
  type,
  disabled = false
}: ButtonProps): React.ReactElement {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick?.(e);
  };
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={cx(css.oAuthbutton, className)}
      type={type}
    >
      {icon && (
        <div className={css.logoContainer}>
          <img className={cx(css.buttonImage, iconClassName)} src={icon} />
        </div>
      )}
      <div className={cx(css.buttonText, { [css.withIcon]: icon })}>{text}</div>
    </button>
  );
}

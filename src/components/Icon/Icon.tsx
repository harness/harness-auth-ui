/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";

import azure from "static/icons/azure.svg";
import bitbucket from "static/icons/bitbucket.svg";
import github from "static/icons/github.svg";
import gitlab from "static/icons/gitlab.svg";
import google from "static/icons/google.svg";
import linkedin from "static/icons/linkedin.svg";
import sso from "static/icons/sso.svg";
import leftArrow from "static/icons/left-arrow.svg";
import warningSign from "static/icons/warning.svg";

export type IconName =
  | "azure"
  | "bitbucket"
  | "github"
  | "gitlab"
  | "google"
  | "linkedin"
  | "sso"
  | "leftArrow"
  | "warningSign";

const iconMap: Record<IconName, string> = {
  azure,
  bitbucket,
  github,
  gitlab,
  google,
  linkedin,
  sso,
  leftArrow,
  warningSign
};

export interface IconProps {
  name: IconName;
  height?: number;
  width?: number;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  height,
  width,
  size = 16,
  className
}) => {
  const finalHeight = height || size;
  const finalWidth = width || size;

  return (
    <img
      src={iconMap[name]}
      height={finalHeight}
      width={finalWidth}
      className={className}
    />
  );
};

export default Icon;

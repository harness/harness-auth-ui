/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";
import HarnessLogo from "static/images/harness-branding.svg";
import bgImageleft from "static/images/bg-image-left.svg";
import cutomers from "static/images/cutomers.svg";
import css from "./BasicLayoutExperimental.module.css";
import { getModuleDetails } from "../utils";
import { useQueryParams } from "hooks/useQueryParams";

interface BasicLayoutExperimentalProps {
  name?: string;
  bgImg?: string;
}
const BasicLayoutExperimental: React.FC<BasicLayoutExperimentalProps> = ({
  children,
  bgImg = bgImageleft
}) => {
  const { module } = useQueryParams();

  const moduleDetails = getModuleDetails(module as string);

  return (
    <div className={css.layoutExperimental}>
      <div
        className={css.imageColumn}
        style={{ background: `url(${bgImg}) repeat` }}
      >
        {moduleDetails.logo && (
          <img
            className={css.foreground}
            src={moduleDetails.logo}
            alt=""
            aria-hidden
          />
        )}
        <div className={css.container}>
          <div>
            <div className={css.branding}>
              <img src={HarnessLogo} alt="" aria-hidden />
            </div>
            <div className={css.title}>{moduleDetails.title}</div>
            <div className={css.tagline} style={{ color: moduleDetails.color }}>
              {moduleDetails.tagLine}
            </div>
            <div className={css.valueProp}>{moduleDetails.valueProp}</div>
            <div
              className={css.hrmodule}
              style={{ background: moduleDetails.color }}
            ></div>
          </div>
          <div className={css.callout}>
            <p className={css.cotext}>{moduleDetails.callout}</p>
            <img src={cutomers} alt="" aria-hidden />
          </div>
        </div>
      </div>
      <div className={css.cardColumn}>
        <div className={css.card}>{children}</div>
      </div>
    </div>
  );
};

export default BasicLayoutExperimental;

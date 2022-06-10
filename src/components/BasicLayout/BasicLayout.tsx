/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from "react";

import { isCommunityPlan } from "utils/DeploymentTypeUtil";
import saasBg from "./saas-bg.png";
import saasFg from "./saas-fg.png";
import communityBg from "./community-bg.png";
import communityFg from "./community-fg.png";
import css from "./BasicLayout.module.css";

interface BasicLayoutProps {
  name?: string;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const isCommunity = isCommunityPlan();
  const bgImg = isCommunity ? communityBg : saasBg;
  const fgImg = isCommunity ? communityFg : saasFg;
  return (
    <div className={css.layout}>
      <div className={css.cardColumn}>
        <div className={css.card}>{children}</div>
      </div>
      <div
        className={css.imageColumn}
        style={{ background: `url(${bgImg}) repeat` }}
      >
        <img className={css.foreground} src={fgImg} alt="" aria-hidden />
      </div>
    </div>
  );
};

export default BasicLayout;

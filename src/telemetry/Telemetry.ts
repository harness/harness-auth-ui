/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import Telemetry from "@harness/telemetry";

const stubTelemetry = {
  identify: () => void 0,
  track: () => void 0,
  page: () => void 0,
  initialized: false
};

const TelemetryInstance =
  window.deploymentType !== "SAAS"
    ? stubTelemetry
    : new Telemetry(window.segmentToken);

export default TelemetryInstance;

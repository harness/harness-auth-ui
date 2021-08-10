import Telemetry from "@wings-software/telemetry";

const stubTelemetry = {
  identify: () => void 0,
  track: () => void 0,
  page: () => void 0
};

const TelemetryInstance = __ON_PREM__
  ? stubTelemetry
  : new Telemetry(window.segmentToken);

export default TelemetryInstance;

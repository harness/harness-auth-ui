import Telemetry from "@wings-software/telemetry";

const TelemetryInstance = new Telemetry(
  window.segmentToken || "exa6lo7CnJXqKnR83itMpHYLY5fiajft"
);

export default TelemetryInstance;

"use client";
// @react-spring/core (transitive dep of @react-three/drei) accesses
// ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentBatchConfig
// which React 19 removed. This module patches it back before the lazy
// Three.js chunks load. Must be imported from an eagerly-loaded client module.
import ReactDOM from "react-dom";

const internals = (ReactDOM as any)
  .__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as Record<
    string,
    unknown
  >;
if (internals && !internals.ReactCurrentBatchConfig) {
  internals.ReactCurrentBatchConfig = { transition: 0 };
}

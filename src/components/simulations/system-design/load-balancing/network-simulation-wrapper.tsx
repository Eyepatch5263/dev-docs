"use client";

import dynamic from "next/dynamic";

const NetworkSimulation = dynamic(() => import("./network-simulation"), {
  ssr: false,
});

export default function NetworkSimulationWrapper() {
  return <NetworkSimulation />;
}

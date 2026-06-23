"use client";

import dynamic from "next/dynamic";

const SslSimulation = dynamic(() => import("./ssl-simulation"), {
  ssr: false,
});

export default function SslSimulationWrapper() {
  return <SslSimulation />;
}

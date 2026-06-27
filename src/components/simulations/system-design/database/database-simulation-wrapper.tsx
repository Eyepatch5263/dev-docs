"use client";

import dynamic from "next/dynamic";

const DatabaseSimulation = dynamic(() => import("./database-simulation"), {
  ssr: false,
});

export default function DatabaseSimulationWrapper() {
  return <DatabaseSimulation />;
}

"use client";

import dynamic from "next/dynamic";

const AlgorithmSimulation = dynamic(() => import("./algorithm-simulation"), {
  ssr: false,
});

export default function AlgorithmSimulationWrapper() {
  return <AlgorithmSimulation />;
}

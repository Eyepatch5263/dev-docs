"use client";

import dynamic from "next/dynamic";

const DnsSimulation = dynamic(() => import("./dns-simulation"), {
  ssr: false,
});

export default function DnsSimulationWrapper() {
  return <DnsSimulation />;
}

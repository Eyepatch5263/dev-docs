export const CubeWireframe = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-16 h-16 stroke-current text-slate-300/40 dark:text-slate-800/40 fill-none"
    strokeWidth="1"
  >
    <path d="M50 15 L85 35 L85 75 L50 95 L15 75 L15 35 Z" />
    <path d="M50 15 L50 55 M15 35 L50 55 L85 35 M50 55 L50 95" />
  </svg>
);

export const OctahedronWireframe = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-14 h-14 stroke-current text-slate-300/40 dark:text-slate-800/40 fill-none"
    strokeWidth="1"
  >
    <path d="M50 5 L95 50 L50 95 L5 50 Z" />
    <path
      d="M50 5 L50 95 M5 50 L95 50 M50 5 L30 50 L50 95 M50 5 L70 50 L50 95 M30 50 L70 50"
      strokeDasharray="2 2"
    />
  </svg>
);

export const SphereWireframe = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-20 h-20 stroke-current text-slate-300/40 dark:text-slate-800/40 fill-none"
    strokeWidth="0.75"
  >
    <circle cx="50" cy="50" r="45" />
    <path d="M5 50 Q50 20 95 50 Q50 80 5 50" />
    <path d="M5 50 H95 M50 5 V95" />
    <path d="M50 5 Q30 50 50 95 Q70 50 50 95" strokeDasharray="3 3" />
  </svg>
);

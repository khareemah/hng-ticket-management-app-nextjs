export function WaveHero() {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,40 Q360,0 720,40 T1440,40 L1440,120 L0,120 Z"
        fill="currentColor"
        className="text-primary/10"
      />
      <path
        d="M0,60 Q360,20 720,60 T1440,60 L1440,120 L0,120 Z"
        fill="currentColor"
        className="text-primary/5"
      />
    </svg>
  );
}

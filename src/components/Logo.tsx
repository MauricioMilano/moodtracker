import React from "react";

type LogoProps = {
  size?: number;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ size = 48, className = "" }) => {
  const textClass =
    "ml-3 text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-100";
  return (
    <div className={`flex items-center ${className}`} aria-hidden={false}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Mood Journal logo"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        <rect width="64" height="64" rx="12" fill="url(#g1)" />

        {/* face */}
        <circle cx="32" cy="30" r="10" fill="white" opacity="0.92" />

        {/* eyes */}
        <circle cx="28" cy="28" r="1.8" fill="#111827" />
        <circle cx="36" cy="28" r="1.8" fill="#111827" />

        {/* smile */}
        <path
          d="M26 34c1.6 2.6 4.6 4 6 4s4.4-1.4 6-4"
          stroke="#111827"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <div className="ml-3">
        <span className={textClass}>Mood Journal</span>
        <span className="block text-xs text-gray-500 dark:text-gray-300">Tracker</span>
      </div>
    </div>
  );
};

export default Logo;
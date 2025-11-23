"use client";

import React, { useEffect, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 500,
  className = "",
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        transition-all ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${className}
      `}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

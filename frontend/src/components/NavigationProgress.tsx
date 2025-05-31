"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

interface NavigationProgressProps {
  color?: string;
  height?: number;
  showSpinner?: boolean;
}

// Component to handle NProgress completion
function NProgressDone() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

const NavigationProgress: React.FC<NavigationProgressProps> = ({
  color = "#4f46e5",
  height = 3,
  showSpinner = false,
}) => {
  // Configure NProgress
  useEffect(() => {
    NProgress.configure({
      showSpinner: showSpinner,
      speed: 500,
      minimum: 0.08,
      easing: "ease",
      positionUsing: "",
      trickleSpeed: 200,
    });

    // Add custom styles
    const style = document.createElement("style");
    style.innerHTML = `
      #nprogress .bar {
        background: ${color} !important;
        height: ${height}px !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px ${color}, 0 0 5px ${color} !important;
      }
      #nprogress .spinner-icon {
        border-top-color: ${color} !important;
        border-left-color: ${color} !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [color, height, showSpinner]);

  return (
    <Suspense fallback={null}>
      <NProgressDone />
    </Suspense>
  );
};

export default NavigationProgress;

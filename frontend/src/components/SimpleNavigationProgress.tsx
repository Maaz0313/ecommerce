"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SimpleNavigationProgressProps {
  color?: string;
  height?: number;
}

const SimpleNavigationProgress: React.FC<SimpleNavigationProgressProps> = ({
  color = "#4f46e5",
  height = 4,
}) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    // Only trigger when pathname changes
    if (pathname !== previousPath) {
      console.log("🔄 Simple loader: Path changed from", previousPath, "to", pathname);
      
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 100);

      // Complete after 800ms
      const completeTimer = setTimeout(() => {
        setProgress(100);
        
        // Hide after completion
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }, 800);

      setPreviousPath(pathname);

      return () => {
        clearInterval(interval);
        clearTimeout(completeTimer);
      };
    }
  }, [pathname, previousPath]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed top-0 left-0 z-50 transition-all duration-300 ease-out"
      style={{
        height: `${height}px`,
        width: `${progress}%`,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
      }}
    />
  );
};

export default SimpleNavigationProgress;

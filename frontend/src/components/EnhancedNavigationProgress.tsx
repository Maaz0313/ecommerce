"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLoading } from '../contexts/LoadingContext';

interface EnhancedNavigationProgressProps {
  color?: string;
  height?: number;
  speed?: number;
  showSpinner?: boolean;
  delay?: number;
  minDuration?: number;
  showOperationText?: boolean;
}

const EnhancedNavigationProgress: React.FC<EnhancedNavigationProgressProps> = ({
  color = '#4f46e5',
  height = 3,
  speed = 150,
  showSpinner = false,
  delay = 100,
  minDuration = 300,
  showOperationText = false,
}) => {
  const { loadingState } = useLoading();
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Refs for timer management
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function for all timers
  const cleanupTimers = () => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (loadingState.isLoading) {
      // Cleanup any existing timers
      cleanupTimers();
      
      setAnimatedProgress(0);
      setShowProgress(false);

      // Start progress after delay to avoid flash for fast operations
      delayTimerRef.current = setTimeout(() => {
        setShowProgress(true);
        
        // Start progress animation
        progressIntervalRef.current = setInterval(() => {
          setAnimatedProgress(prev => {
            // Use actual progress from context if available, otherwise simulate
            const targetProgress = loadingState.progress || 0;
            
            if (targetProgress >= 100) {
              // Complete immediately if we have 100% progress
              return 100;
            } else if (targetProgress > prev) {
              // Animate towards the target progress
              const diff = targetProgress - prev;
              return prev + Math.min(diff * 0.3, 5); // Smooth animation
            } else if (prev >= 90 && targetProgress === 0) {
              // Hold at 90% if no explicit progress is set
              return prev;
            } else {
              // Simulate progress if no explicit progress is available
              const increment = Math.random() * 8 + 2; // 2-10% increments
              return Math.min(prev + increment, 90);
            }
          });
        }, speed);
      }, delay);

    } else {
      // Loading finished - complete the progress
      if (showProgress) {
        setAnimatedProgress(100);
        
        // Hide progress bar after completion animation
        completeTimerRef.current = setTimeout(() => {
          setShowProgress(false);
          setAnimatedProgress(0);
        }, 200);
      }
    }

    return cleanupTimers;
  }, [loadingState.isLoading, loadingState.progress, speed, delay]);

  // Cleanup timers on unmount
  useEffect(() => {
    return cleanupTimers;
  }, []);

  if (!showProgress) return null;

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 z-50 transition-all duration-200 ease-out"
        style={{
          height: `${height}px`,
          width: `${animatedProgress}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
          opacity: showProgress ? 1 : 0,
        }}
      />
      
      {/* Operation text */}
      {showOperationText && loadingState.currentOperation && (
        <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg px-3 py-2 text-sm text-gray-700">
          {loadingState.currentOperation}
        </div>
      )}
      
      {/* Optional spinner */}
      {showSpinner && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className="animate-spin rounded-full border-2 border-t-transparent w-6 h-6"
            style={{ borderColor: `${color} transparent transparent transparent` }}
          />
        </div>
      )}
    </>
  );
};

export default EnhancedNavigationProgress;

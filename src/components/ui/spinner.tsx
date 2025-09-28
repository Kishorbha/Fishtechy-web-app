"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("relative inline-block", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 dark:border-t-blue-400 animate-spin"></div>
    </div>
  );
}

export function CircularSpinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative inline-block", sizeClasses[size], className)}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>

      {/* Animated ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 dark:border-t-blue-400 animate-spin"></div>

      {/* Inner dots */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

export function BarsSpinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative inline-block", sizeClasses[size], className)}>
      {/* 12 bars arranged in a circle */}
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="absolute w-1 h-3 bg-gray-300 dark:bg-gray-600 rounded-full origin-bottom"
          style={{
            transform: `rotate(${index * 30}deg) translateY(-${
              size === "sm" ? "8px" : size === "md" ? "12px" : "16px"
            })`,
            animationDelay: `${index * 0.1}s`,
            animation: "barsSpin 1.2s linear infinite",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes barsSpin {
          0% {
            opacity: 1;
            transform: rotate(var(--rotation)) translateY(var(--translate))
              scaleY(1);
          }
          50% {
            opacity: 0.3;
            transform: rotate(var(--rotation)) translateY(var(--translate))
              scaleY(0.5);
          }
          100% {
            opacity: 1;
            transform: rotate(var(--rotation)) translateY(var(--translate))
              scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}

export function DotsSpinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative inline-block", sizeClasses[size], className)}>
      {/* 8 dots arranged in a circle */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="absolute w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full"
          style={{
            transform: `rotate(${index * 45}deg) translateY(-${
              size === "sm" ? "8px" : size === "md" ? "12px" : "16px"
            })`,
            animationDelay: `${index * 0.1}s`,
            animation: "dotsSpin 1.6s ease-in-out infinite",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes dotsSpin {
          0%,
          100% {
            opacity: 0.3;
            transform: rotate(var(--rotation)) translateY(var(--translate))
              scale(0.5);
          }
          50% {
            opacity: 1;
            transform: rotate(var(--rotation)) translateY(var(--translate))
              scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export function LoadingSpinner({
  type = "circular",
  size = "md",
  className,
  text,
}: SpinnerProps & {
  type?: "circular" | "bars" | "dots" | "simple";
  text?: string;
}) {
  const renderSpinner = () => {
    switch (type) {
      case "bars":
        return <BarsSpinner size={size} className={className} />;
      case "dots":
        return <DotsSpinner size={size} className={className} />;
      case "simple":
        return <Spinner size={size} className={className} />;
      default:
        return <CircularSpinner size={size} className={className} />;
    }
  };

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        {renderSpinner()}
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    );
  }

  return renderSpinner();
}

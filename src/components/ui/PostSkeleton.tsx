"use client";

import { motion } from "framer-motion";

export function PostSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Media Skeleton */}
      <div className="w-full h-64 bg-gray-200 animate-pulse" />

      {/* Actions Skeleton */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-2">
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

export function PostSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

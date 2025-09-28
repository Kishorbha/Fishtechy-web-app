"use client";

import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface InfiniteScrollProps<T> {
  queryKey: (string | number)[];
  queryFn: (pageParam: number) => Promise<{
    results: T[];
    page: number;
    hasNextPage: boolean;
    totalPages?: number;
    totalDocs?: number;
  }>;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  skeletonCount?: number;
  className?: string;
  itemClassName?: string;
  options?: Omit<
    UseInfiniteQueryOptions,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >;
}

export function InfiniteScroll<T>({
  queryKey,
  queryFn,
  renderItem,
  renderSkeleton,
  skeletonCount = 3,
  className = "space-y-4",
  itemClassName = "",
  options = {},
}: InfiniteScrollProps<T>) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return queryFn(page);
    },
    getNextPageParam: (lastPage) => {
      if (
        lastPage &&
        lastPage.hasNextPage &&
        typeof lastPage.page === "number"
      ) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    ...(options as any),
  });

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten and deduplicate items
  const allItems = data?.pages?.flatMap((page: any) => page.results) || [];
  const items = allItems.filter(
    (item, index, self: T[]) =>
      index ===
      self.findIndex((i) => JSON.stringify(i) === JSON.stringify(item))
  );

  // Show loading state only for initial load or when no items exist
  const showLoadingState = isLoading && items.length === 0;

  if (showLoadingState) {
    return (
      <div className={className}>
        {renderSkeleton ? (
          renderSkeleton()
        ) : (
          <div className="space-y-4">
            {[...Array(skeletonCount)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="space-y-2">
                      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Failed to load content
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please try again later.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📷</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No content yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {items.map((item: T, index: number) => (
        <div key={index} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}

      {/* Load more trigger */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Loading more...
            </span>
          </div>
        )}
      </div>

      {/* Loading skeleton for next page */}
      {isFetchingNextPage && renderSkeleton && (
        <div className="mt-4">{renderSkeleton()}</div>
      )}

      {/* Show skeleton while data is being processed */}
      {isFetchingNextPage && !renderSkeleton && (
        <div className="mt-4 space-y-4">
          {[...Array(skeletonCount)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

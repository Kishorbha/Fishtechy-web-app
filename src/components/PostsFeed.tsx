"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, type Post } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { OptimizedVideoPlayer } from "./OptimizedVideoPlayer";
import { LoadingSpinner } from "@/components/ui/spinner";
import { InfiniteScroll } from "@/components/ui/InfiniteScroll";
import { PostSkeletonList } from "@/components/ui/PostSkeleton";
import { VideoMetadata } from "./VideoMetadata";

export function PostsFeed() {
  const queryClient = useQueryClient();

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: (postId: string) => apiClient.likePost(postId),
    onSuccess: (data, postId) => {
      // Update the posts in the cache
      queryClient.setQueryData(["posts"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            results: page.results.map((post: Post) =>
              post.id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likesCount:
                      (post.likesCount || 0) + (post.isLiked ? -1 : 1),
                  }
                : post
            ),
          })),
        };
      });
    },
    onError: (error) => {
      console.error("Like error:", error);
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const renderPost = (post: Post, index: number) => (
    <motion.article
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={
                post.user?.avatar ||
                `https://ui-avatars.com/api/?name=${
                  post.user?.fullName || "User"
                }&background=random&color=fff`
              }
              alt={post.user?.username || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {post.user?.username || "User"}
              </span>
              {post.user?.isVerified && (
                <span className="text-blue-500 text-sm">✓</span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Media */}
      <div className="relative bg-black">
        {(() => {
          // Filter media to only show VIDEO and IMAGE types
          const validMedia = post.medias?.filter(
            (media) => media.fileType === "VIDEO" || media.fileType === "IMAGE"
          );

          const firstMedia = validMedia?.[0];

          if (!firstMedia) {
            // Fallback to imageUrl if no valid media found
            return (
              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800">
                <img
                  src={post.imageUrl || "https://via.placeholder.com/400x400"}
                  alt={post.caption || "Post image"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            );
          }

          if (firstMedia.fileType === "VIDEO") {
            return (
              <div className="relative w-full aspect-square bg-black">
                <OptimizedVideoPlayer
                  videoKey={firstMedia.url}
                  poster={firstMedia.thumbnail}
                  autoPlay={false}
                  muted={true}
                  loop={true}
                  preload="metadata"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <VideoMetadata videoKey={firstMedia.url} />
                </div>
              </div>
            );
          } else if (firstMedia.fileType === "IMAGE") {
            return (
              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800">
                <img
                  src={firstMedia.url}
                  alt={post.caption || "Post image"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            );
          }

          return null;
        })()}
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(post.id)}
              className={cn(
                "p-0",
                post.isLiked
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-500"
              )}
            >
              <Heart
                className={cn("w-6 h-6", post.isLiked && "fill-current")}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 text-gray-400 hover:text-gray-300"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 text-gray-400 hover:text-gray-300"
            >
              <Share className="w-6 h-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 text-gray-400 hover:text-gray-300"
          >
            <Bookmark className="w-6 h-6" />
          </Button>
        </div>

        {/* Likes Count */}
        {(post.likesCount || 0) > 0 && (
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatNumber(post.likesCount || 0)} like
              {(post.likesCount || 0) !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Caption */}
        {(post.caption || post.note) && (
          <div className="mb-2">
            <span className="text-sm text-gray-900 dark:text-white">
              <span className="font-semibold">
                {post.user?.username || "User"}
              </span>{" "}
              {post.caption || post.note}
            </span>
          </div>
        )}

        {/* Comments Count */}
        {(post.commentsCount || 0) > 0 && (
          <div className="mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              View all {formatNumber(post.commentsCount || 0)} comment
              {(post.commentsCount || 0) !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Location */}
        {post.location && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            📍 Location
          </div>
        )}
      </div>
    </motion.article>
  );

  return (
    <InfiniteScroll
      queryKey={["posts"]}
      queryFn={(page) => apiClient.getPosts(page)}
      renderItem={renderPost}
      renderSkeleton={() => <PostSkeletonList count={3} />}
      skeletonCount={3}
    />
  );
}

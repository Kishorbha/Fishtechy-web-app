"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

interface VideoMetadataProps {
  videoKey: string;
  className?: string;
}

export function VideoMetadata({
  videoKey,
  className = "",
}: VideoMetadataProps) {
  // Extract S3 key from full URL
  const getS3Key = (fullUrl: string) => {
    const publicIndex = fullUrl.indexOf("public/");
    if (publicIndex !== -1) {
      return fullUrl.substring(publicIndex);
    }
    return `public/${fullUrl}`;
  };

  const s3Key = getS3Key(videoKey);

  const { data: metadata, isLoading } = useQuery({
    queryKey: ["video-metadata", s3Key],
    queryFn: () => apiClient.getVideoMetadata(s3Key),
    enabled: !!s3Key,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div
        className={`flex items-center space-x-4 text-xs text-gray-500 ${className}`}
      >
        <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!metadata) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div
      className={`flex items-center space-x-4 text-xs text-gray-500 ${className}`}
    >
      <span>⏱️ {formatDuration(metadata.duration)}</span>
      <span>📏 {metadata.resolution}</span>
      <span>💾 {formatFileSize(metadata.size)}</span>
      {metadata.bitrate > 0 && (
        <span>📊 {formatNumber(metadata.bitrate / 1000)}kbps</span>
      )}
    </div>
  );
}

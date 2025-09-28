"use client";

import { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

interface VideoPlayerProps {
  videoKey: string;
  poster?: string;
}

// Cache for signed URLs to prevent repeated API calls
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 50 * 60 * 1000; // 50 minutes (signed URLs expire in 60 minutes)

export function VideoPlayer({ videoKey, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Extract S3 key from full URL (get part after "public/")
  const getS3Key = (fullUrl: string) => {
    const publicIndex = fullUrl.indexOf("public/");
    if (publicIndex !== -1) {
      return fullUrl.substring(publicIndex); // Keep "public/" part
    }
    return `public/${fullUrl}`; // Add "public/" prefix if not found
  };

  const s3Key = getS3Key(videoKey);
  console.log("s3Key", s3Key);

  // Fetch signed URL for video streaming with caching
  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        setIsLoading(true);

        // Check cache first
        const cached = urlCache.get(s3Key);
        const now = Date.now();

        if (cached && now - cached.timestamp < CACHE_DURATION) {
          console.log("Using cached signed URL for key:", s3Key);
          setVideoUrl(cached.url);
          setIsLoading(false);
          return;
        }

        // Check if token exists before making API call
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found");
          setIsLoading(false);
          return;
        }

        console.log("Fetching new signed URL for key:", s3Key);
        console.log("Token present:", !!token);

        const data = await apiClient.getVideoUrl(s3Key);
        console.log("Received signed URL:", data.url);

        // Cache the URL
        urlCache.set(s3Key, { url: data.url, timestamp: now });
        setVideoUrl(data.url);
      } catch (error) {
        console.error("Error fetching video URL:", error);
        // Fallback to direct URL if signed URL fails
        const fallbackUrl = `${
          apiClient.baseURL
        }/files/video?key=${encodeURIComponent(s3Key)}`;
        console.log("Using fallback URL:", fallbackUrl);
        setVideoUrl(fallbackUrl);
      } finally {
        setIsLoading(false);
      }
    };

    if (s3Key) {
      fetchSignedUrl();
    }
  }, [s3Key]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(false);

  return (
    <div
      className="relative w-full bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          className="w-full h-auto object-cover"
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          controls={false}
          onError={(e) => {
            console.error("Video error:", e);
            setIsLoading(false);
          }}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          crossOrigin="anonymous"
        />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Play/Pause overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
          >
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </Button>
        </div>
      )}

      {/* Controls overlay */}
      {showControls && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Video indicator */}
      <div className="absolute top-4 right-4">
        <div className="px-2 py-1 bg-black bg-opacity-50 rounded text-white text-xs">
          VIDEO
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

interface OptimizedVideoPlayerProps {
  videoKey: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
}

// Global cache for video URLs and metadata
const videoCache = new Map<
  string,
  {
    url: string;
    timestamp: number;
    metadata?: { duration: number; size: number };
  }
>();
const CACHE_DURATION = 50 * 60 * 1000; // 50 minutes

// Intersection Observer for lazy loading (client-side only)
const intersectionObserver =
  typeof window !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const video = entry.target as HTMLVideoElement;
              const loadVideo = video.dataset.loadVideo;
              if (loadVideo) {
                video.src = loadVideo;
                video.removeAttribute("data-load-video");
              }
            }
          });
        },
        { rootMargin: "100px" }
      )
    : null;

export function OptimizedVideoPlayer({
  videoKey,
  poster,
  autoPlay = false,
  muted = true,
  loop = true,
  preload = "metadata",
}: OptimizedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isInView, setIsInView] = useState(false);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  // Extract S3 key from full URL
  const getS3Key = useCallback((fullUrl: string) => {
    const publicIndex = fullUrl.indexOf("public/");
    if (publicIndex !== -1) {
      return fullUrl.substring(publicIndex);
    }
    return `public/${fullUrl}`;
  }, []);

  const s3Key = getS3Key(videoKey);

  // Fetch video URL with caching
  const fetchVideoUrl = useCallback(async () => {
    try {
      // Check cache first
      const cached = videoCache.get(s3Key);
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setVideoUrl(cached.url);
        setIsLoading(false);
        return;
      }

      // Fetch new signed URL from optimized endpoint
      const data = await apiClient.getVideoUrl(s3Key);

      // Cache the URL
      videoCache.set(s3Key, { url: data.url, timestamp: now });
      setVideoUrl(data.url);
    } catch (error) {
      console.error("Error fetching video URL:", error);
      // Fallback to direct streaming from optimized endpoint
      const fallbackUrl = `${
        apiClient.baseURL
      }/files-optimized/video?key=${encodeURIComponent(s3Key)}`;
      setVideoUrl(fallbackUrl);
    } finally {
      setIsLoading(false);
    }
  }, [s3Key]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting && !hasStartedLoading) {
            setHasStartedLoading(true);
            fetchVideoUrl();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [fetchVideoUrl, hasStartedLoading]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setIsLoading(false);
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, []);

  // Auto-play when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView || !autoPlay) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, [isInView, autoPlay]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleMouseEnter = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowControls(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {videoUrl && hasStartedLoading && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop={loop}
          playsInline
          preload={preload}
          controls={false}
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

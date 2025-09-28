"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { apiClient, type Notification } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Trophy,
  DollarSign,
  CheckCircle,
  X,
  MoreHorizontal,
  Award,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { InfiniteScroll } from "@/components/ui/InfiniteScroll";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch notifications with infinite scroll
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    error: notificationsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) => apiClient.getNotifications(pageParam, 20),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: isAuthenticated,
  });
  console.log(notificationsData, "Notifications Data");
  // Fetch unread count
  const { data: unreadCount } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: () => apiClient.getUnreadNotificationCount(),
    enabled: isAuthenticated,
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => apiClient.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (error) => {
      toast.error("Failed to mark notifications as read");
      console.error("Mark all read error:", error);
    },
  });

  // Mark single notification as read mutation
  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      apiClient.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
    onError: (error) => {
      console.error("Mark read error:", error);
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "COMMENT":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "FOLLOW":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case "CHALLENGE_INVITATION":
      case "CHALLENGE_INVITATION_ACCEPTED":
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case "NEWFEEDBACK":
        return <MessageCircle className="w-5 h-5 text-orange-500" />;
      case "MODERATION_PENDING":
      case "MODERATOR_ASSIGNED":
        return <Award className="w-5 h-5 text-purple-500" />;
      case "MEASUREMENT_CONFIRMED":
      case "MEASUREMENT_DELETED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "TRANSACTION":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    const senderName =
      notification.sender?.fullName ||
      notification.sender?.username ||
      "Someone";

    switch (notification.type) {
      case "LIKE":
        return `${senderName} liked your post`;
      case "COMMENT":
        return `${senderName} commented on your post`;
      case "FOLLOW":
        return `${senderName} started following you`;
      case "CHALLENGE_INVITATION":
        return `${senderName} invited you to a challenge`;
      case "CHALLENGE_INVITATION_ACCEPTED":
        return `${senderName} accepted your challenge invitation`;
      case "NEWFEEDBACK":
        return `${senderName} submitted new feedback`;
      case "MODERATION_PENDING":
        return `Your post is pending moderation`;
      case "MODERATOR_ASSIGNED":
        return `${senderName} was assigned as moderator`;
      case "MEASUREMENT_CONFIRMED":
        return `Your measurement has been confirmed`;
      case "MEASUREMENT_DELETED":
        return `Your measurement has been deleted`;
      case "TRANSACTION":
        return `Transaction completed`;
      default:
        return "New notification";
    }
  };

  const handleMarkAsRead = (notification: Notification) => {
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <LoadingSpinner type="circular" size="lg" text="Loading..." />
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Left Sidebar */}
      <LeftSidebar user={user} />

      {/* Main Content */}
      <div className="lg:ml-72 max-w-4xl mx-auto px-4 py-8 pt-20 lg:pt-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </h1>
                  {unreadCount && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {notificationsData?.pages?.[0]?.results &&
                  notificationsData.pages[0].results.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAllReadMutation.mutate()}
                      disabled={markAllReadMutation.isPending}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {markAllReadMutation.isPending ? (
                        <LoadingSpinner type="simple" size="sm" />
                      ) : (
                        "Mark all as read"
                      )}
                    </Button>
                  )}
              </div>
            </div>
          </div>

          {/* Notifications Content */}
          <div>
            {notificationsLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner
                  type="circular"
                  size="lg"
                  text="Loading notifications..."
                />
              </div>
            ) : notificationsError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Failed to load notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please try again later.
                </p>
                <Button
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["notifications"],
                    })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Retry
                </Button>
              </div>
            ) : !notificationsData?.pages?.[0]?.results ||
              notificationsData.pages[0].results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🔔</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No notifications yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You'll see notifications here when people interact with your
                  content.
                </p>
              </div>
            ) : (
              <InfiniteScroll
                queryKey={["notifications"]}
                queryFn={(pageParam) =>
                  apiClient.getNotifications(pageParam, 20)
                }
                renderItem={(notification: Notification, index: number) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-all duration-200 ${
                      !notification.read
                        ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleMarkAsRead(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {notification.sender?.avatar ? (
                          <img
                            src={notification.sender.avatar}
                            alt={
                              notification.sender.fullName ||
                              notification.sender.username
                            }
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {(
                                notification.sender?.fullName ||
                                notification.sender?.username ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getNotificationIcon(notification.type)}
                          <p className="text-sm text-gray-900 dark:text-white">
                            {getNotificationMessage(notification)}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(new Date(notification.createdAt))}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                renderSkeleton={() => (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                skeletonCount={5}
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:block fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-30">
        <RightSidebar />
      </div>
    </div>
  );
}

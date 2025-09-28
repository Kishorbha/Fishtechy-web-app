"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  Menu,
  Settings,
  X,
  Bookmark,
  Moon,
  AlertCircle,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useTheme } from "@/contexts/ThemeContext";

interface LeftSidebarProps {
  user?: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
}

export function LeftSidebar({ user }: LeftSidebarProps) {
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);

  // Fetch unread notification count
  const { data: unreadCount } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: () => apiClient.getUnreadNotificationCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const navigationItems = [
    { href: "/", icon: Home, label: "Home", active: pathname === "/" },
    {
      href: "/search",
      icon: Search,
      label: "Search",
      active: pathname === "/search",
    },
    {
      href: "/explore",
      icon: Compass,
      label: "Explore",
      active: pathname === "/explore",
    },

    {
      href: "/messages",
      icon: MessageCircle,
      label: "Messages",
      active: pathname === "/messages",
    },
    {
      href: "/notifications",
      icon: Heart,
      label: "Notifications",
      active: pathname === "/notifications",
    },
    {
      href: "/create",
      icon: PlusSquare,
      label: "Create",
      active: pathname === "/create",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      active: pathname === "/profile",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-black dark:to-gray-900 border-r border-gray-200 dark:border-gray-700/50 z-50 backdrop-blur-sm",
          "lg:translate-x-0",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-8 pb-6">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-3 rounded-2xl transition-all duration-300">
                  <img
                    src="/assets/logo.svg"
                    alt="Fishtechy Logo"
                    className="w-20 h-20 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </Link>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-6 py-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-12 px-3 py-3 transition-all duration-200 group relative overflow-hidden rounded-lg",
                        item.active
                          ? "text-gray-900 dark:text-white font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <div className="relative flex items-center">
                        <Icon
                          className={cn(
                            "w-6 h-6 mr-4 transition-all duration-200",
                            item.active
                              ? "text-gray-900 dark:text-white"
                              : "group-hover:text-gray-900 dark:group-hover:text-white"
                          )}
                        />
                        <span className="text-base font-normal">
                          {item.label}
                        </span>
                        {item.href === "/notifications" &&
                          unreadCount &&
                          unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                      </div>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* More */}
          <div className="px-6 py-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMoreModalOpen(true);
              }}
              className="w-full justify-start h-12 px-3 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group rounded-lg"
            >
              <Menu className="w-6 h-6 mr-4 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200" />
              <span className="text-base font-normal">More</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* More Modal - Instagram Style */}
      <AnimatePresence>
        {isMoreModalOpen && (
          <>
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60]"
              onClick={() => setIsMoreModalOpen(false)}
            />

            {/* Modal Content - Positioned like Instagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-20 left-4 lg:bottom-24 lg:left-4 z-[70] w-64 bg-gray-800 dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-700 dark:border-gray-600 overflow-hidden"
            >
              {/* Modal Content */}
              <div className="py-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    // Add settings navigation here
                  }}
                  className="w-full justify-start h-12 px-4 text-white hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span className="text-sm">Settings</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    // Add your activity navigation here
                  }}
                  className="w-full justify-start h-12 px-4 text-white hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <span className="text-sm">Your Activity</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    // Add saved navigation here
                  }}
                  className="w-full justify-start h-12 px-4 text-white hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <Bookmark className="w-5 h-5 mr-3" />
                  <span className="text-sm">Saved</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                  className="w-full justify-start h-12 px-4 text-white hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <Moon className="w-5 h-5 mr-3" />
                  <span className="text-sm">Switch appearance</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    // Add report problem here
                  }}
                  className="w-full justify-start h-12 px-4 text-white hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <AlertCircle className="w-5 h-5 mr-3" />
                  <span className="text-sm">Report a problem</span>
                </Button>

                {/* Separator */}
                <div className="border-t border-gray-700 dark:border-gray-600 my-1" />

                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    // Add switch accounts here
                  }}
                  className="w-full justify-start h-12 px-4 text-white hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span className="text-sm">Switch accounts</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    logout();
                  }}
                  className="w-full justify-start h-12 px-4 text-white hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <span className="text-sm">Log out</span>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

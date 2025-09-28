"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Search,
  Compass,
  Play,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  Menu,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const { logout } = useAuth();

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
      href: "/reels",
      icon: Play,
      label: "Reels",
      active: pathname === "/reels",
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
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-black dark:to-gray-900 border-r border-gray-200 dark:border-gray-700/50 z-40 backdrop-blur-sm"
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 pb-8">
          <Link href="/" className="flex items-center justify-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl transition-all duration-300">
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
        <nav className="flex-1 px-4 py-2">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} prefetch={true}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-14 px-4 transition-all duration-300 group relative overflow-hidden",
                      item.active
                        ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-gray-900 dark:text-white font-semibold border border-blue-500/30 shadow-lg shadow-blue-500/10"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600/50 border border-transparent"
                    )}
                  >
                    {item.active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
                    )}
                    <div className="relative flex items-center">
                      <Icon
                        className={cn(
                          "w-6 h-6 mr-4 transition-all duration-300",
                          item.active
                            ? "text-blue-400"
                            : "group-hover:text-blue-400"
                        )}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        {user && (
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-100 dark:bg-gradient-to-r dark:from-gray-800/50 dark:to-gray-700/30 border border-gray-200 dark:border-gray-600/30 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border-2 border-gray-300 dark:border-gray-700 group-hover:border-blue-400 transition-colors duration-300">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {user.fullName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                  {user.username}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {user.fullName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* More */}
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-14 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600/50 border border-transparent transition-all duration-300 group"
          >
            <Menu className="w-6 h-6 mr-4 group-hover:text-blue-400 transition-colors duration-300" />
            <span className="text-sm font-medium">More</span>
          </Button>
        </div>

        {/* Settings & Logout */}
        <div className="px-4 py-4 pb-6 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600/50 border border-transparent transition-all duration-300 group"
          >
            <Settings className="w-5 h-5 mr-4 group-hover:text-blue-400 transition-colors duration-300" />
            <span className="text-sm font-medium">Settings</span>
          </Button>
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start h-12 px-4 text-gray-600 dark:text-gray-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-transparent transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 mr-4 group-hover:text-red-400 transition-colors duration-300" />
            <span className="text-sm font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

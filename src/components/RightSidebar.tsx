"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Mock data for suggestions
const mockSuggestions = [
  {
    id: "1",
    username: "john_doe",
    name: "John Doe",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    mutualFollowers: 5,
  },
  {
    id: "2",
    username: "jane_smith",
    name: "Jane Smith",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    mutualFollowers: 12,
  },
  {
    id: "3",
    username: "mike_wilson",
    name: "Mike Wilson",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    mutualFollowers: 3,
  },
];

export function RightSidebar() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState(mockSuggestions);

  const handleFollow = (userId: string) => {
    setSuggestions((prev) => prev.filter((user) => user.id !== userId));
  };
  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden lg:block w-80 p-6 space-y-6"
    >
      {/* User Profile */}
      {user && (
        <div className="flex items-center space-x-3 py-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {user.fullName?.charAt(0) ||
                      user.username?.charAt(0) ||
                      "U"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {user.username}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {user.fullName ||
                `${user.firstName || ""} ${user.lastName || ""}`.trim()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-xs font-semibold">
              Switch
            </button>
          </div>
        </div>
      )}

      {/* Suggestions Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          Suggestions For You
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 text-xs font-semibold px-2 py-1"
        >
          See All
        </Button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 overflow-hidden">
                  <img
                    src={suggestion.profilePicture}
                    alt={suggestion.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {suggestion.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {suggestion.username}
                </p>
                {suggestion.isVerified && (
                  <svg
                    className="w-3 h-3 text-blue-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {suggestion.mutualFollowers} mutual followers
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFollow(suggestion.id)}
              className="text-blue-400 hover:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-blue-400/10 transition-colors"
            >
              Follow
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Help
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Press
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              API
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Jobs
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Locations
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Language
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              © 2024
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Fishtechy
            </span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

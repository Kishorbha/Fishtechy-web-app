"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock stories data
const mockStories = [
  {
    id: "1",
    username: "john_doe",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isViewed: false,
  },
  {
    id: "2",
    username: "jane_smith",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isViewed: true,
  },
  {
    id: "3",
    username: "mike_wilson",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isViewed: false,
  },
  {
    id: "4",
    username: "sarah_jones",
    profilePicture:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isViewed: true,
  },
  {
    id: "5",
    username: "alex_brown",
    profilePicture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    isViewed: false,
  },
];

export function Stories() {
  return (
    <div className="p-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {/* Add Story Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium">Your Story</span>
        </motion.div>

        {/* Stories */}
        {mockStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer"
          >
            <div className="relative">
              <div
                className={cn(
                  "w-16 h-16 rounded-full p-0.5",
                  story.isViewed
                    ? "bg-gray-600"
                    : "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                )}
              >
                <div className="w-full h-full rounded-full bg-black p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={story.profilePicture}
                      alt={story.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium max-w-16 truncate">
              {story.username}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

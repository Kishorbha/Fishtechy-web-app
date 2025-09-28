"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: Error) => {
              // Don't retry on 401 errors
              if (
                error?.message?.includes("401") ||
                error?.message?.includes("Unauthorized")
              ) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="instagram-theme">
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--toast-bg, #262626)",
              color: "var(--toast-color, #fff)",
              border: "1px solid var(--toast-border, #404040)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

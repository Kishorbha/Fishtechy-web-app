"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, type User } from "@/lib/api";
import { tokenManager } from "@/lib/tokenManager";
import toast from "react-hot-toast";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  // Initialize auth state from tokenManager
  useEffect(() => {
    const tokens = tokenManager.getTokens();
    const user = localStorage.getItem("user");

    if (tokens && user) {
      apiClient.setToken(tokens.accessToken);
      setAuthState({
        user: JSON.parse(user),
        token: tokens.accessToken,
        isLoading: false,
        isAuthenticated: true,
      });

      // Setup automatic token refresh
      tokenManager.setupAutoRefresh();
    } else if (tokenManager.getRefreshToken()) {
      // Try to refresh token if access token is missing but refresh token exists
      refreshTokenFromStorage();
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Refresh token from tokenManager
  const refreshTokenFromStorage = async () => {
    try {
      const refreshed = await tokenManager.refreshAccessToken();

      if (refreshed) {
        apiClient.setToken(refreshed.accessToken);

        // Get user profile
        const user = await apiClient.getProfile();
        localStorage.setItem("user", JSON.stringify(user));

        setAuthState({
          user,
          token: refreshed.accessToken,
          isLoading: false,
          isAuthenticated: true,
        });

        // Setup automatic token refresh
        tokenManager.setupAutoRefresh();
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Query for user profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.getProfile(),
    enabled: authState.isAuthenticated,
    retry: false,
  });

  // Update auth state when profile data changes
  useEffect(() => {
    if (profileData && authState.isAuthenticated) {
      setAuthState((prev) => ({
        ...prev,
        user: profileData,
      }));
      localStorage.setItem("user", JSON.stringify(profileData));
    }
  }, [profileData, authState.isAuthenticated]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
    onSuccess: (data) => {
      // Store tokens using tokenManager
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      apiClient.setToken(data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setAuthState({
        user: data.user,
        token: data.accessToken,
        isLoading: false,
        isAuthenticated: true,
      });

      // Setup automatic token refresh
      tokenManager.setupAutoRefresh();

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      username: string;
    }) => apiClient.register(userData),
    onSuccess: (data) => {
      // Store tokens using tokenManager
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      apiClient.setToken(data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setAuthState({
        user: data.user,
        token: data.accessToken,
        isLoading: false,
        isAuthenticated: true,
      });

      // Setup automatic token refresh
      tokenManager.setupAutoRefresh();

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Registration successful!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: {
      firstName?: string;
      lastName?: string;
      username?: string;
      bio?: string;
      profilePicture?: string;
    }) => apiClient.updateProfile(profileData),
    onSuccess: (data) => {
      setAuthState((prev) => ({
        ...prev,
        user: data,
      }));
      localStorage.setItem("user", JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Profile update failed");
    },
  });

  const login = async (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }) => {
    return registerMutation.mutateAsync(userData);
  };

  const updateProfile = async (profileData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
    profilePicture?: string;
  }) => {
    return updateProfileMutation.mutateAsync(profileData);
  };

  const logout = () => {
    // Clear tokens using tokenManager
    tokenManager.clearTokens();
    apiClient.setToken(null);

    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });

    queryClient.clear();
    router.push("/auth/login");
  };

  const refreshToken = async () => {
    try {
      const refreshed = await tokenManager.refreshAccessToken();

      if (refreshed) {
        apiClient.setToken(refreshed.accessToken);
        setAuthState((prev) => ({
          ...prev,
          token: refreshed.accessToken,
        }));
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  // Listen for logout events from API client
  useEffect(() => {
    const handleLogout = () => {
      // Clear tokens using tokenManager
      tokenManager.clearTokens();
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      queryClient.clear();
      router.push("/auth/login");
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [router, queryClient]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/auth/login");
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  return {
    ...authState,
    isLoading: authState.isLoading || profileLoading,
    login,
    register,
    updateProfile,
    logout,
    refreshToken,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isUpdateLoading: updateProfileMutation.isPending,
  };
}

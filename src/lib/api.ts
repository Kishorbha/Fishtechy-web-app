import { tokenManager } from "./tokenManager";
import { ApiInterceptor } from "./apiInterceptor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

class ApiClient {
  public baseURL: string;
  private interceptor: ApiInterceptor;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.interceptor = new ApiInterceptor({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  setToken(token: string | null) {
    // Legacy method for compatibility - now handled by tokenManager
    if (token) {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        tokenManager.setTokens(token, refreshToken);
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    return this.interceptor.request<T>(endpoint, options);
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{
      success: boolean;
      accessToken: string;
      refreshToken: string;
      user: User;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }) {
    return this.request<{
      success: boolean;
      accessToken: string;
      refreshToken: string;
      user: User;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        fullName: `${userData.firstName} ${userData.lastName}`,
        username: userData.username,
      }),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{
      success: boolean;
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User methods
  async getProfile() {
    return this.request<User>("/users/me");
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
    profilePicture?: string;
  }) {
    return this.request<User>("/users/me", {
      method: "PUT",
      body: JSON.stringify({
        fullName:
          profileData.firstName && profileData.lastName
            ? `${profileData.firstName} ${profileData.lastName}`
            : undefined,
        username: profileData.username,
        avatar: profileData.profilePicture,
      }),
    });
  }

  async getUserByUsername(username: string) {
    return this.request<{
      results: User[];
      page: number;
      limit: number;
      totalPages: number;
      totalDocs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    }>(`/users/search?username=${username}`);
  }

  async followUser(userId: string) {
    return this.request<{
      success: boolean;
      isFollowing: boolean;
      followersCount: number;
    }>(`/users/${userId}/follow`, {
      method: "POST",
    });
  }

  // Posts methods (using catches/feeds from Node API)
  async getPosts(page = 1, limit = 10) {
    return this.request<{
      results: Post[];
      page: number;
      limit: number;
      totalPages: number;
      totalDocs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    }>(
      `/feeds/explore?page=${page}&limit=${limit}&includeFields=medias,user.avatar200,user.fullName,user.username,fish.name,likes,comments,moderationStatus,user.avatar,createdAt`
    );
  }

  async createPost(postData: {
    caption?: string;
    imageUrl: string;
    location?: string;
  }) {
    return this.request<Post>("/catches", {
      method: "POST",
      body: JSON.stringify({
        note: postData.caption,
        estimatedLength: 0,
        estimatedGirth: 0,
        estimatedWeight: 0,
        fishId: "000000000000000000000000", // Placeholder fish ID
        medias: [
          {
            fileType: "image",
            url: postData.imageUrl,
          },
        ],
        location: postData.location
          ? {
              coordinates: [0, 0], // Placeholder coordinates
            }
          : undefined,
      }),
    });
  }

  async likePost(postId: string) {
    return this.request<{
      success: boolean;
    }>(`/feeds/${postId}/likes`, {
      method: "POST",
    });
  }

  // Video methods
  async getVideoUrl(key: string) {
    return this.request<{
      url: string;
    }>(`/files-optimized/video-url?key=${encodeURIComponent(key)}`);
  }

  async getVideoMetadata(key: string) {
    return this.request<{
      duration: number;
      size: number;
      format: string;
      bitrate: number;
      resolution: string;
    }>(`/files-optimized/video-metadata?key=${encodeURIComponent(key)}`);
  }

  async getVideoThumbnail(key: string, time: string = "00:00:01") {
    return `${
      this.baseURL
    }/files-optimized/video-thumbnail?key=${encodeURIComponent(
      key
    )}&time=${time}`;
  }

  async getVideoPreview(key: string, quality: string = "medium") {
    return `${
      this.baseURL
    }/files-optimized/video-preview?key=${encodeURIComponent(
      key
    )}&quality=${quality}`;
  }

  // Health check
  async healthCheck() {
    return this.request<{
      status: string;
      timestamp: string;
    }>("/webhooks/health");
  }
}

// Types (adapted for Node API)
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  avatar200?: string;
  phoneNumberVerified: boolean;
  emailVerified: boolean;
  role: string[];
  createdAt: string;
  updatedAt: string;
  // Fishtechy app compatibility fields
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  owner: string;
  note?: string;
  medias: {
    fileType: "IMAGE" | "VIDEO";
    url: string;
    thumbnail?: string;
  }[];
  location?: {
    coordinates: number[];
    placeMark?: string;
  };
  createdAt: string;
  updatedAt: string;
  estimatedLength: number;
  estimatedGirth: number;
  estimatedWeight: number;
  fishId: string;
  // Fishtechy app compatibility fields
  userId?: string;
  caption?: string;
  imageUrl?: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  user?: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
    isVerified?: boolean;
  };
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isVerified: boolean;
  };
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

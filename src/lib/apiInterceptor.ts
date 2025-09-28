/**
 * API Request Interceptor for automatic token management
 * Handles token injection, refresh, and retry logic
 */

import { tokenManager } from "./tokenManager";

interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

interface InterceptorOptions {
  baseURL: string;
  timeout?: number;
}

class ApiInterceptor {
  private baseURL: string;
  private timeout: number;

  constructor(options: InterceptorOptions) {
    this.baseURL = options.baseURL;
    this.timeout = options.timeout || 10000;
  }

  /**
   * Intercept and enhance API requests
   */
  async intercept(config: RequestConfig): Promise<Response> {
    // Add authentication header
    const accessToken = await tokenManager.getValidAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add default headers
    config.headers["Content-Type"] =
      config.headers["Content-Type"] || "application/json";
    config.headers["Accept"] = "application/json";

    // Make the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body,
        signal: controller.signal,
        credentials: "include",
        mode: "cors",
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        return this.handleUnauthorized(config);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Handle 401 Unauthorized responses
   */
  private async handleUnauthorized(
    originalConfig: RequestConfig
  ): Promise<Response> {
    // Try to refresh token
    const refreshed = await tokenManager.refreshAccessToken();

    if (refreshed) {
      // Retry original request with new token
      const newConfig = {
        ...originalConfig,
        headers: {
          ...originalConfig.headers,
          Authorization: `Bearer ${refreshed.accessToken}`,
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(newConfig.url, {
          method: newConfig.method,
          headers: newConfig.headers,
          body: newConfig.body,
          signal: controller.signal,
          credentials: "include",
          mode: "cors",
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } else {
      // Refresh failed, dispatch logout event
      this.dispatchLogoutEvent();
      throw new Error("Authentication failed");
    }
  }

  /**
   * Dispatch logout event for auth state cleanup
   */
  private dispatchLogoutEvent(): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
  }

  /**
   * Create a request with automatic retry logic
   */
  async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      headers?: Record<string, string>;
      retries?: number;
    } = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {}, retries = 1 } = options;

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestConfig = {
      url,
      method,
      headers,
      body: body,
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.intercept(config);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              errorData.message ||
              `HTTP error! status: ${response.status}`
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on authentication errors
        if (
          error instanceof Error &&
          error.message.includes("Authentication failed")
        ) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === retries) {
          break;
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    throw lastError!;
  }
}

export { ApiInterceptor };
export type { RequestConfig, InterceptorOptions };

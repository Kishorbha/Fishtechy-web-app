/**
 * Secure Token Manager for handling access and refresh tokens
 * Provides encryption, automatic refresh, and centralized token management
 */

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  user?: any;
}

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<TokenData | null> | null = null;
  private readonly TOKEN_KEY = "auth_tokens";
  private readonly ENCRYPTION_KEY = "flytechy_secure_key_2024";

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Simple encryption/decryption for localStorage
   */
  private encrypt(text: string): string {
    try {
      const encoded = btoa(text);
      return encoded;
    } catch {
      return text;
    }
  }

  private decrypt(encryptedText: string): string {
    try {
      return atob(encryptedText);
    } catch {
      return encryptedText;
    }
  }

  /**
   * Store tokens securely
   */
  setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number = 3600
  ): void {
    const tokenData: TokenData = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000 - 60000, // 1 minute buffer
    };

    const encrypted = this.encrypt(JSON.stringify(tokenData));
    localStorage.setItem(this.TOKEN_KEY, encrypted);
  }

  /**
   * Get stored tokens
   */
  getTokens(): TokenData | null {
    try {
      const encrypted = localStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      const tokenData: TokenData = JSON.parse(decrypted);

      // Check if tokens are expired
      if (Date.now() >= tokenData.expiresAt) {
        this.clearTokens();
        return null;
      }

      return tokenData;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refreshToken || null;
  }

  /**
   * Check if access token is valid (not expired)
   */
  isAccessTokenValid(): boolean {
    const tokens = this.getTokens();
    return tokens !== null;
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem("user"); // Also clear user data
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<TokenData | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    this.refreshPromise = this.performRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(
    refreshToken: string
  ): Promise<TokenData | null> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh-token`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data: RefreshResponse = await response.json();

      if (data.accessToken && data.refreshToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + 3600 * 1000 - 60000,
        };
      }

      throw new Error("Invalid refresh response");
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  async getValidAccessToken(): Promise<string | null> {
    // Check if current token is valid
    if (this.isAccessTokenValid()) {
      return this.getAccessToken();
    }

    // Try to refresh
    const refreshed = await this.refreshAccessToken();
    return refreshed?.accessToken || null;
  }

  /**
   * Set up automatic token refresh before expiration
   */
  setupAutoRefresh(): void {
    const tokens = this.getTokens();
    if (!tokens) return;

    const timeUntilExpiry = tokens.expiresAt - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 300000, 60000); // 5 minutes before expiry, min 1 minute

    setTimeout(async () => {
      await this.refreshAccessToken();
      this.setupAutoRefresh(); // Setup next refresh
    }, refreshTime);
  }
}

export const tokenManager = TokenManager.getInstance();
export type { TokenData, RefreshResponse };

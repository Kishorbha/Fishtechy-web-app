// Development configuration
export const config = {
  // Database
  DATABASE_URL:
    "postgresql://postgres:password@localhost:5432/instagram_clone?schema=public",

  // JWT
  JWT_SECRET: "instagram-clone-super-secret-jwt-key-for-development",

  // Server
  PORT: 3001,
  NODE_ENV: "development",

  // Frontend
  FRONTEND_URL: "http://localhost:3000",
  NEXT_PUBLIC_API_URL: "http://localhost:9000",

  // API Base URL
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000",
};

export default config;

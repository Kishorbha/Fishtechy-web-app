"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Form, FormField, FormButton } from "@/components/ui/Form";
import { loginSchema } from "@/lib/validations";
import { LoadingSpinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, isLoginLoading } = useAuth();

  const handleSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-lg dark:shadow-none">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className=" p-3 rounded-lg mr-3">
                <img
                  src="/assets/logo.svg"
                  alt="Fishtechy Logo"
                  className="w-full h-full"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Form<LoginFormData>
            onSubmit={handleSubmit}
            defaultValues={{ email: "", password: "" }}
            className="space-y-4"
          >
            {(form) => (
              <>
                <FormField
                  form={form}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  validation={loginSchema.email}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500"
                />

                <FormField
                  form={form}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  validation={loginSchema.password}
                  showPasswordToggle={true}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500"
                />

                <FormButton
                  isLoading={isLoginLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {isLoginLoading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner type="simple" size="sm" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </FormButton>
              </>
            )}
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/auth/register"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-semibold"
              >
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Demo Credentials
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                <strong>Email:</strong> test@test.com
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

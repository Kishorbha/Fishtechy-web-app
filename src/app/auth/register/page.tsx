"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Form, FormField, FormButton } from "@/components/ui/Form";
import { registerSchema } from "@/lib/validations";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { register, isRegisterLoading } = useAuth();

  const handleSubmit = async (data: RegisterFormData) => {
    setError("");
    try {
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg mr-3">
                <img
                  src="/assets/logo.svg"
                  alt="Fishtechy Logo"
                  className="w-8 h-8"
                />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                Fishtechy
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign up
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Form<RegisterFormData>
            onSubmit={handleSubmit}
            defaultValues={{
              firstName: "",
              lastName: "",
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            className="space-y-4"
          >
            {(form) => (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    form={form}
                    name="firstName"
                    label="First Name"
                    placeholder="First name"
                    validation={registerSchema.firstName}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500"
                  />
                  <FormField
                    form={form}
                    name="lastName"
                    label="Last Name"
                    placeholder="Last name"
                    validation={registerSchema.lastName}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500"
                  />
                </div>

                <FormField
                  form={form}
                  name="username"
                  label="Username"
                  placeholder="Username"
                  validation={registerSchema.username}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                />

                <FormField
                  form={form}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  validation={registerSchema.email}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                />

                <FormField
                  form={form}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  validation={registerSchema.password}
                  showPasswordToggle={true}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                />

                <FormField
                  form={form}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  validation={registerSchema.confirmPassword}
                  showPasswordToggle={true}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                />

                <FormButton
                  isLoading={isRegisterLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Sign Up
                </FormButton>
              </>
            )}
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-semibold"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

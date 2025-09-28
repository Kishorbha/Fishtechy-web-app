"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Form, FormField, FormButton } from "@/components/ui/Form";
import { profileSchema } from "@/lib/validations";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
}

export default function ProfilePage() {
  const [error, setError] = useState("");
  const { user, updateProfile, isUpdateLoading } = useAuth();

  const handleSubmit = async (data: ProfileFormData) => {
    setError("");
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        bio: data.bio,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Parse fullName into firstName and lastName
  const nameParts = user.fullName?.split(" ") || ["", ""];
  const defaultFirstName = nameParts[0] || "";
  const defaultLastName = nameParts.slice(1).join(" ") || "";

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
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your profile information
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Form<ProfileFormData>
            onSubmit={handleSubmit}
            defaultValues={{
              firstName: defaultFirstName,
              lastName: defaultLastName,
              username: user.username || "",
              bio: user.bio || "",
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
                    validation={profileSchema.firstName}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500"
                  />
                  <FormField
                    form={form}
                    name="lastName"
                    label="Last Name"
                    placeholder="Last name"
                    validation={profileSchema.lastName}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500"
                  />
                </div>

                <FormField
                  form={form}
                  name="username"
                  label="Username"
                  placeholder="Username"
                  validation={profileSchema.username}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                />

                <FormField
                  form={form}
                  name="bio"
                  label="Bio"
                  type="textarea"
                  placeholder="Tell us about yourself..."
                  validation={profileSchema.bio}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                />

                <FormButton
                  isLoading={isUpdateLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Update Profile
                </FormButton>
              </>
            )}
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              <a
                href="/"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Back to Home
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

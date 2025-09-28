"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Form, FormField, FormButton } from "@/components/ui/Form";
import { profileSchema } from "@/lib/validations";

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
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-lg dark:shadow-none">
          <div className="text-center mb-6">
            {/* User Avatar */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {user.avatar200 || user.avatar ? (
                  <img
                    src={user.avatar200 || user.avatar}
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
                    <span className="text-white text-2xl font-bold">
                      {user.fullName?.charAt(0) ||
                        user.username?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                )}
                {/* Edit Avatar Button */}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 transition-colors">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Info */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {user.fullName || user.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              @{user.username}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Edit your profile information below
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

"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, refreshUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsername(user.username);
    } else {
      refreshUser();
    }
  }, [user, refreshUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate password change if fields are filled
      if (oldPassword || newPassword || confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          toast.error("Please fill all password fields");
          setLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          toast.error("New passwords don't match");
          setLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
      }

      const response = await axios.put("/api/users/updateprofile", {
        username: username !== user?.username ? username : undefined,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined,
      });

      toast.success(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);

      // Refresh user data
      await refreshUser();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      const response = await axios.post("/api/users/resendverification");
      toast.success(response.data.message);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(
        err.response?.data?.error || "Failed to resend verification email",
      );
    } finally {
      setResendingEmail(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black px-4 py-8">
      <div className="max-w-2xl mx-auto mb-6">
        <Link
          href="/scripts"
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
        >
          <ArrowLeft />
          Go back
        </Link>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
            Profile
          </h1>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Username
                </div>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email Field (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                  <div className="relative group">
                    {user.isVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 cursor-help" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 cursor-help" />
                    )}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                      {user.isVerified
                        ? "Email Verified"
                        : "Email Not Verified"}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </div>
                  </div>
                </div>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
              />
              {!user.isVerified && (
                <>
                  <div className="flex flex-1 flex-col mt-1">
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      Please verify your email address
                    </p>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendingEmail}
                      className=" mt-4 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-medium rounded whitespace-nowrap"
                    >
                      {resendingEmail
                        ? "Sending..."
                        : "Send Verification Email"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Password Update Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Lock className="w-4 h-4" />
                {showPasswordFields ? "Hide" : "Change"} Password
              </button>
            </div>

            {/* Password Fields */}
            {showPasswordFields && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                {/* Old Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your current password"
                    autoComplete="off"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    autoComplete="off"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="off"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/scripts")}
              className="w-full py-2 px-2 border  disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

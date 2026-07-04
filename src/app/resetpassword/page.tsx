"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
      const token = window.location.search.split("=")[1];
      if (token?.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(token);
      }
  }, []);

  const handleBtnClick = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      await axios.post("/api/users/resetpassword", { token, newPassword });
      toast.success("Password reset successfully!");
      router.push("/login");

    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }, [token, router, newPassword, confirmPassword]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
        <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
          Reset Your Password
        </h1>
        <p className="mb-6 text-zinc-700 dark:text-zinc-300">
          Please create 
        </p>
        <input
          name="newPassword"
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          placeholder="Enter new password"
          className="w-full mb-4 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white"
        />
        <input
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm new password"
          className="w-full mb-4 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white"
        />
        <button
          onClick={handleBtnClick}
          className="w-full m-1 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
        >
          Reset Password
        </button>
      </div>
    </main>
  );
}

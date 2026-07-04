"use client";

import React, { useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const { user } = useUser();
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
      const token = window.location.search.split("=")[1];
      if (token.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(token);
      }
  }, []);

  const handleBtnClick = useCallback(async () => {
    try {
      
      await axios.post("/api/users/verifyemail", { token });
      toast.success("Email verified successfully!");
      router.push("/login");

    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }, [token]);

  useEffect(() => {}, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
        <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
          Verify Your Email
        </h1>
        <p className="mb-6 text-zinc-700 dark:text-zinc-300">
          Please click on the below button to verify your email address.
        </p>
        <button
          onClick={handleBtnClick}
          className="w-full m-1 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
        >
          Verify your email
        </button>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { nanoid } from "nanoid";
import ScriptForm from "@/components/ScriptForm";

type ScriptStatus = "Idea" | "Drafting" | "Ready" | "Shot" | "Posted";

export default function CreateScriptPage() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    hook: string;
    content: string;
    cta: string;
    status: ScriptStatus;
    instagramLink: string;
    locations: string[];
  }) => {
    setLoading(true);
    try {
      await axios.post("/api/scripts", {
        id: nanoid(),
        ...data,
        userId: user?._id,
      });

      toast.success("Script created successfully");
      router.push("/scripts");
    } catch (error) {
      console.error("Error creating script:", error);
      toast.error("Failed to create script");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  return (
    <main className=" bg-zinc-50 px-4 py-6 dark:bg-black flex flex-col">
      <div className="w-full flex-shrink-0 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-0">
          🚀 Your Next Viral Idea Starts Here
        </h1>
      </div>

      <div className="flex-1">
        <ScriptForm
          isEditing={false}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => router.back()}
        />
      </div>
    </main>
  );
}

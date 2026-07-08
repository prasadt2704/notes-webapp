"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import ScriptForm from "@/components/ScriptForm";

type ScriptStatus = "Idea" | "Drafting" | "Ready" | "Shot" | "Posted";

interface ScriptData {
  title: string;
  hook: string;
  content: string;
  cta: string;
  status: ScriptStatus;
  instagramLink: string;
  locations?: string[];
}

export default function EditScriptPage() {
  const router = useRouter();
  const params = useParams();
  const scriptId = params.id as string;
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scriptData, setScriptData] = useState<ScriptData | null>(null);

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await axios.get("/api/scripts", {
          params: { id: scriptId },
        });
        setScriptData({
          title: response.data.title,
          hook: response.data.hook,
          content: response.data.content,
          cta: response.data.cta,
          status: response.data.status,
          instagramLink: response.data.instagramLink || "",
          locations: response.data.locations || [],
        });
      } catch (error) {
        console.error("Error fetching script:", error);
        toast.error("Failed to load script");
        router.push("/scripts");
      } finally {
        setInitialLoading(false);
      }
    };

    if (scriptId) {
      void fetchScript();
    }
  }, [scriptId, router]);

  const handleSubmit = async (data: ScriptData) => {
    setLoading(true);

    try {
      await axios.put("/api/scripts", {
        id: scriptId,
        ...data,
        userId: user?._id,
      });

      toast.success("Script updated successfully");
      router.push("/scripts");
    } catch (error) {
      console.error("Error updating script:", error);
      toast.error("Failed to update script");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading script...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-zinc-50 px-4 py-6 dark:bg-black flex flex-col">
      <div className="w-full flex-shrink-0 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          ✏️ Edit Script
        </h1>
      </div>

      <div className="flex-1 min-h-0">
        {scriptData && (
          <ScriptForm
            isEditing={true}
            initialData={scriptData}
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={() => router.back()}
          />
        )}
      </div>
    </main>
  );
}

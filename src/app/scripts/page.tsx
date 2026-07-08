"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2, Zap } from "lucide-react";
import axios from "axios";
import { useUser } from "@/context/UserContext";

type ScriptStatus = "Idea" | "Drafting" | "Ready" | "Shot" | "Posted";

type ScriptItem = {
  id: string;
  title: string;
  hook: string;
  content: string;
  cta: string;
  status: ScriptStatus;
  instagramLink?: string;
};

const STATUS_COLORS: Record<ScriptStatus, string> = {
  Idea: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  Drafting: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200",
  Ready: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200",
  Shot: "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200",
  Posted: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200",
};

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, searchQuery, refreshUser } = useUser();

  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  const fetchScripts = useCallback(async () => {
    try {
      const response = await axios.get("/api/scripts", {
        params: searchQuery.trim() ? { search: searchQuery.trim() } : undefined,
      });
      setScripts(response.data);
    } catch (error) {
      setScripts([]);
      console.error("Error fetching scripts:", error);
    }
  }, [searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchScripts();
  }, [fetchScripts]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDeleteScript = async (event: any, id: string) => {
    event.stopPropagation();
    setLoading(true);

    try {
      await axios.delete("/api/scripts", { data: { id } });
      await fetchScripts();
      toast.success("Script deleted successfully");
    } catch (error) {
      console.error("Error deleting script:", error);
      toast.error("Failed to delete script");
    } finally {
      setLoading(false);
    }
  };

  const onEditScript = (scriptId: string) => {
    router.push(`/scripts/edit/${scriptId}`);
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black">
      <div className='w-fit'>
      <Link href="/scripts/edit">
        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">New Script</span>
        </button>
      </Link>
      </div>

      <section>
        {searchQuery.length > 0 && scripts.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No data available
            </p>
          </div>
        )}

        {searchQuery.length === 0 && scripts.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No scripts yet. Create your first script to get started!
            </p>
          </div>
        )}

        {scripts.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 mt-6">
            {scripts.map((item) => (
              <article
                onClick={() => onEditScript(item.id)}
                key={item.id}
                className="group relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-md transition-all break-inside-avoid flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-white truncate flex-1">
                    {item.title}
                  </h3>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      STATUS_COLORS[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.hook && <div className="mb-3 p-3 bg-blue-50 dark:bg-zinc-800 rounded-md border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.hook}
                  </p>
                </div>}

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-15 flex-1 overflow-hidden">
                  {item.content}
                </p>

                {item.cta && (
                  <div className="mb-2 p-2  border-l-4 bg-green-50 dark:bg-zinc-800 rounded text-xs text-green-700 dark:text-green-300 font-medium">
                    {item.cta}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    aria-label="Edit script"
                    onClick={() => onEditScript(item.id)}
                    className="rounded-md p-2 text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete script"
                    onClick={async (event) => {
                      await onDeleteScript(event, item.id);
                    }}
                    disabled={loading}
                    className="rounded-md p-2 text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

type ScriptStatus = "Idea" | "Drafting" | "Ready" | "Shot" | "Posted";

const STATUS_OPTIONS: ScriptStatus[] = ["Idea", "Drafting", "Ready", "Shot", "Posted"];

interface ScriptFormProps {
  isEditing?: boolean;
  initialData?: {
    title: string;
    hook: string;
    content: string;
    cta: string;
    status: ScriptStatus;
    instagramLink: string;
    locations?: string[];
  };
  onSubmit: (data: {
    title: string;
    hook: string;
    content: string;
    cta: string;
    status: ScriptStatus;
    instagramLink: string;
    locations: string[];
  }) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
}

export default function ScriptForm({
  isEditing = false,
  initialData,
  onSubmit,
  loading,
  onCancel,
}: ScriptFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [hook, setHook] = useState(initialData?.hook || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [cta, setCta] = useState(initialData?.cta || "");
  const [status, setStatus] = useState<ScriptStatus>(initialData?.status || "Idea");
  const [instagramLink, setInstagramLink] = useState(initialData?.instagramLink || "");
  const [locations, setLocations] = useState<string[]>(initialData?.locations || [""]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onSubmit({
        title: title.trim(),
        hook: hook.trim(),
        content: content.trim(),
        cta: cta.trim(),
        status,
        instagramLink: instagramLink.trim(),
        locations: locations.filter(loc => loc.trim()).map(loc => loc.trim())
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg flex flex-col"
    >
      {/* Scrollable Content */}
      <div className="flex-1 p-6 space-y-4">
        {/* Title and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Script Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md px-3 py-2 text-base font-semibold text-zinc-900 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:focus:ring-blue-900"
            placeholder="e.g., Morning Routine Tips"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ScriptStatus)}
            className="w-full rounded-md px-3 py-2 text-zinc-900 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:focus:ring-blue-900"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hook and CTA Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hook
          </label>
          <textarea
            value={hook}
            onChange={(event) => setHook(event.target.value)}
            className="w-full h-16 rounded-md px-3 py-2 text-zinc-900 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:focus:ring-blue-900"
            placeholder="Attention-grabbing hook..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Call-to-Action (CTA)
          </label>
          <textarea
            value={cta}
            onChange={(event) => setCta(event.target.value)}
            className="w-full h-16 rounded-md px-3 py-2 text-zinc-900 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:focus:ring-blue-900"
            placeholder="e.g., Follow for more..."
          />
        </div>
      </div>

      {/* Main Script Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Script Content
        </label>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="w-full h-65 rounded-md px-3 py-2 text-zinc-900 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:focus:ring-blue-900"
          placeholder="Write your full script here..."
          required
        />
      </div>

      {/* Instagram Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Instagram Reference Link (Optional)
        </label>
        <input
          type="url"
          value={instagramLink}
          onChange={(event) => setInstagramLink(event.target.value)}
          className="w-full rounded-md px-3 py-2 text-zinc-900 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:focus:ring-blue-900"
          placeholder="https://instagram.com/..."
        />
      </div>

      {/* Locations */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filming Locations (Optional)
          </label>
          <button
            type="button"
            onClick={() => setLocations([...locations, ""])}
            className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Location
          </button>
        </div>
        <div className="space-y-2">
          {locations.map((location, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(event) => {
                  const newLocations = [...locations];
                  newLocations[index] = event.target.value;
                  setLocations(newLocations);
                }}
                className="flex-1 rounded-md px-3 py-2 text-zinc-900 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:focus:ring-blue-900"
                placeholder="e.g., Coffee Shop, Park, Beach"
              />
              {locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => setLocations(locations.filter((_, i) => i !== index))}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-500 rounded-md transition-colors"
                  aria-label="Remove location"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      </div>

      {/* Fixed Bottom Buttons */}
      <div className="border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-md border border-zinc-300 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !content.trim() || !title.trim()}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {loading ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
}

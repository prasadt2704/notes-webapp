"use client";

import { FormEvent, useState } from "react";

type NoteFormValues = {
  id?: string;
  title: string;
  content: string;
};

type NoteModalProps = {
  loading?: boolean;
  data: NoteFormValues | null;
  onCancel: () => void;
  onSubmit: (values: NoteFormValues) => Promise<void>;
};

export default function NoteModal({
  loading = false,
  data,
  onCancel,
  onSubmit,
}: NoteModalProps) {
  const [title, setTitle] = useState(data?.title ?? "");
  const [content, setContent] = useState(data?.content ?? "");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ title: title.trim(), content: content.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg h-150 rounded-xl bg-white p-3 shadow-2xl dark:bg-zinc-900"
        onClick={(event) => event.stopPropagation()}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full m-0 rounded-md px-3 py-2 text-2xl font-bold text-zinc-1000 outline-none transition-colors focus:border-blue-500 dark:text-white"
              placeholder="Title"
            />
          </>

            <textarea
              id="note-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-115 m-0 w-full resize-none rounded-md px-3 py-1 text-zinc-900 outline-none transition-colors focus:border-blue-500 dark:text-white"
              placeholder="Take a note..."
              required
              
            />

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-md border border-zinc-300 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

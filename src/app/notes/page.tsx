"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import NoteModal from "@/components/Note";
import axios from "axios";
import { useUser } from "@/context/UserContext";

type NoteItem = {
  id: string;
  title: string;
  content: string;
};

export default function NotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get("/api/notes");
      setNotes(response.data);
    } catch (error) {
      setNotes([]);
      console.error("Error fetching notes:", error);
    }
  }, []);

    useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotes();
  }, [fetchNotes]);

  const onCreateNote = async (values: { title: string; content: string }) => {
    setLoading(true);

    try {
      await axios.post("/api/notes", {
          id: `${Date.now()}`,
          title: values.title,
          content: values.content,
          userId: user?._id,
        });

      await fetchNotes();
      
      toast.success("Note added");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex h-10 items-center justify-center rounded-lg bg-blue-600 p-3 text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        <Plus className="w-5 h-5" />
      </button>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
              {item.title}
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.content}</p>
          </article>
        ))}
      </section>

      <NoteModal
        isOpen={isModalOpen}
        loading={loading}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={onCreateNote}
      />
    </main>
  );
}
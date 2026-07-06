"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import NoteModal from "@/components/Note";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { nanoid } from "nanoid";


type NoteItem = {
  id: string;
  title: string;
  content: string;
};

type NoteFormValues = {
  title: string;
  content: string;
};

export default function NotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, searchQuery } = useUser();
  const [updateNote, setUpdateNote] = useState<NoteItem | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get("/api/notes", {
        params: searchQuery.trim() ? { search: searchQuery.trim() } : undefined,
      });
      setNotes(response.data);
    } catch (error) {
      setNotes([]);
      console.error("Error fetching notes:", error);
    }
  }, [searchQuery]);

    useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotes();
  }, [fetchNotes]);

  const onCreateNote = async (values: NoteFormValues) => {
    setLoading(true);

    try {
      await axios.post("/api/notes", {
          id: nanoid(),
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

  const onUpdateNote = async (values: NoteFormValues) => {
    if (!updateNote?.id) {
      toast.error("No note selected for update");
      return;
    }

    setLoading(true);
    try {
      await axios.put("/api/notes", {
          id: updateNote.id,
          title: values.title,
          content: values.content,
          userId: user?._id,
        });
        
      await fetchNotes();
      toast.success("Note updated");
      setIsModalOpen(false);
      setUpdateNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteNote = async (id: string) => {
    setLoading(true);

    try {
      await axios.delete("/api/notes", { data: { id } });
      await fetchNotes();
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black">
      <button
        type="button"
        onClick={() => {
          setUpdateNote(null);
          setIsModalOpen(true);
        }}
        className="flex h-10 items-center justify-center rounded-lg bg-blue-600 p-3 text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        <Plus className="w-5 h-5" />
      </button>

      <section className="mt-6 h-100% columns-1 gap-4 sm:columns-2 lg:columns-4">
        {notes.map((item) => (
          <article
            key={item.id}
            onClick={() => {
              setUpdateNote(item);
              setIsModalOpen(true);
            }}
            className="group mb-4 flex w-full max-h-150 break-inside-avoid flex-col rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 className="mb-2 truncate text-xl font-semibold text-zinc-900 dark:text-white">
              {item.title}
            </h3>
            <p className="text-sm line-clamp-22 max-h-110 overflow-hidden text-zinc-700 dark:text-zinc-300">
              {item.content}
            </p>
            <div
              className="flex items-center justify-end gap-2 pt-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Edit note"
                onClick={(event) => {
                  event.stopPropagation();
                  setUpdateNote(item);
                  setIsModalOpen(true);
                }}
                className="rounded-md p-2 text-black transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete note"
                onClick={(event) => {
                  event.stopPropagation();
                  void onDeleteNote(item.id);
                }}
                className="rounded-md p-2 text-black transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </section>

      {isModalOpen && (
        <NoteModal
          loading={loading}
          onCancel={() => {
            setIsModalOpen(false);
            setUpdateNote(null);
          }}
          onSubmit={updateNote?.id ? onUpdateNote : onCreateNote}
          data={updateNote}
        />
      )}
    </main>
  );
}
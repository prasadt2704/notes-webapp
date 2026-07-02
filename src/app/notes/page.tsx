"use client"
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus } from "lucide-react"

export default function NotesPage() {
  const router = useRouter();
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  // const onCreateNote = async () => {
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     const response = await axios.post("/api/notes", note);
  //     const data = response.data as { message?: string };
  //     const successMessage = data.message ?? "Note created successfully";

  //     setMessage(successMessage);
  //     toast.success(successMessage);
  //     router.push("/notes");
  //   } catch (error: unknown) {
  //     let errorMessage = "Something went wrong";

  //     if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
  //       errorMessage =
  //         error.response?.data?.error ??
  //         error.response?.data?.message ??
  //         error.message;
  //     } else if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }

  //     toast.error(errorMessage);
  //     setMessage(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <main className="flex min-h-screen bg-zinc-50 px-4 dark:bg-black">
      <button className="flex justify-center items-center text-white bg-blue-600 p-3 mt-10 h-10 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl dark:bg-blue-700 dark:hover:bg-blue-600">
        <Plus className="w-5 h-5" />
      </button>
    </main>
  );
} 
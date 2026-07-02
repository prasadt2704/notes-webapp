"use client"
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginComponent() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const onLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/users/login", user);
      const data = response.data as { message?: string };
      const successMessage = data.message ?? "Login successful";

      setMessage(successMessage);
      toast.success(successMessage);
      router.push("/notes");
    } catch (error: unknown) {
      let errorMessage = "Something went wrong";

      if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
        errorMessage =
          error.response?.data?.error ??
          error.response?.data?.message ??
          error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
       <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
         <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Welcome back</h1>
         <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Login to continue to your dashboard.</p>

         <form className="mt-6 space-y-4">
           <div>
             <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
               Email
             </label>
             <input
               id="email"
               name="email"
               type="email"
               placeholder="you@example.com"
               value={user.email}
               onChange={onInputChange}
               className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-0 transition focus:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400"
             />
           </div>

           <div>
             <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
               Password
             </label>
             <input
               id="password"
               name="password"
               type="password"
               placeholder="********"
               value={user.password}
               onChange={onInputChange}
               className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-0 transition focus:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400"
             />
           </div>

           <button
             onClick={() => onLogin()}
             type="button"
             disabled={loading || !user.email || !user.password}
             className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500 disabled:opacity-25 dark:bg-blue-700 dark:hover:bg-blue-600"
           >
             {loading ? "Logging in..." : "Login"}
           </button>
         </form>

         {message ? (
           <p className="mt-4 text-center text-sm text-zinc-700 dark:text-zinc-300" role="status">
             {message}
           </p>
         ) : null}

         <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
           Don&apos;t have an account?{" "}
           <Link href="/signup" className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-200">
             Go to signup
           </Link>
         </p>
       </section>
     </main>
  );
}
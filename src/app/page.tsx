import Link from "next/link";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 flex items-center justify-center gap-3">
          <Zap className="w-16 h-16 text-white-500 dark:text-black-500 " />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Scripta</span>
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Create Viral Scripts in Minutes
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6">
          Write, organize, and manage your content scripts from hook to posting. Never lose an idea for viral content again.
        </p>

        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
          Join content creators who are scripting their way to viral success.
        </p>
        
        <Link href="/login">
          <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            Start Creating Scripts
          </button>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup">
            <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
              Sign up here
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

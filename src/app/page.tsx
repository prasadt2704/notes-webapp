import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="text-center max-w-2xl">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Capture Your Thoughts
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
          Create, organize, and manage your notes all in one place. Never miss an idea again.
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-500 mb-12">
          Start writing your first note today. It only takes a moment.
        </p>
        <Link href="/login">
          <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            Login to Get Started
          </button>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
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

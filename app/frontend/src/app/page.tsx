import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Goal Tracker</h1>
      <p className="mt-4 text-xl">Track the goals of your matches.</p>
      <Link href="/auth">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Login
        </button>
      </Link>
    </main>
  );
}

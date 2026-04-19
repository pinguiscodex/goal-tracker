export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-10">Login to Goal Tracker</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Username" className="" />
        <input type="password" placeholder="Password" className="" />
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </main>
  );
}

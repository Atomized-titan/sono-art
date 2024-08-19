import UserPlaylists from "@/components/user-playlists";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Your Spotify Dashboard</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Explore and manage your playlists
        </p>
      </header>
      <main>
        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Playlists</h2>
          <UserPlaylists />
        </section>
      </main>
    </div>
  );
}

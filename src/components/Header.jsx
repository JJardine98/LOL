import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gray-900 bg-opacity-90 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
          Level One Lunatics
        </Link>
        <nav className="flex gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isActive("/")
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-300 hover:text-yellow-400 hover:bg-gray-800"
            }`}
          >
            Home
          </Link>
          <Link
            to="/leaderboard"
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isActive("/leaderboard")
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-300 hover:text-yellow-400 hover:bg-gray-800"
            }`}
          >
            Leaderboard
          </Link>
          <Link
            to="/achievements"
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isActive("/achievements")
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-300 hover:text-yellow-400 hover:bg-gray-800"
            }`}
          >
            Achievements
          </Link>
        </nav>
      </div>
    </header>
  );
}

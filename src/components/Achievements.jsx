import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/data/achievements.json")
      .then(res => res.json())
      .then(data => setAchievements(data));

    fetch("/data/members.json")
      .then(res => res.json())
      .then(data => setMembers(data));
  }, []);

  const categories = ["all", ...new Set(achievements.map(a => a.category))];

  const filteredAchievements = filter === "all"
    ? achievements
    : achievements.filter(a => a.category === filter);

  const getCompletionRate = (achievementName) => {
    const earnedBy = members.filter(m => m.achievements.includes(achievementName)).length;
    return Math.round((earnedBy / members.length) * 100) || 0;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'PvP': 'bg-red-900 bg-opacity-50 text-red-300 border-red-700',
      'PvE': 'bg-green-900 bg-opacity-50 text-green-300 border-green-700',
      'Quest': 'bg-yellow-900 bg-opacity-50 text-yellow-300 border-yellow-700',
      'Dungeon': 'bg-blue-900 bg-opacity-50 text-blue-300 border-blue-700',
      'Raid': 'bg-purple-900 bg-opacity-50 text-purple-300 border-purple-700'
    };
    return colors[category] || 'bg-gray-700 bg-opacity-50 text-gray-300 border-gray-600';
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Guild Achievements</h1>
          <p className="text-gray-400">Browse all available achievements and see who has earned them</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === category
                  ? "bg-yellow-500 text-gray-900 shadow-lg"
                  : "bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-opacity-70 border border-gray-600"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm">Total Achievements</div>
            <div className="text-2xl font-bold text-white">{achievements.length}</div>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm">Earned by Members</div>
            <div className="text-2xl font-bold text-green-400">
              {members.reduce((acc, m) => acc + m.achievements.length, 0)}
            </div>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm">Average per Member</div>
            <div className="text-2xl font-bold text-blue-400">
              {members.length > 0
                ? (members.reduce((acc, m) => acc + m.achievements.length, 0) / members.length).toFixed(1)
                : "0"}
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map(achievement => {
            const earnedBy = members.filter(m => m.achievements.includes(achievement.name));
            const completionRate = getCompletionRate(achievement.name);

            return (
              <div
                key={achievement.name}
                className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-yellow-500 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-gray-600">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg mb-1">{achievement.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded border ${getCategoryColor(achievement.category)}`}>
                        {achievement.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-yellow-900 bg-opacity-50 text-yellow-300 rounded border border-yellow-700">
                        {achievement.points} pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Completion Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Guild Completion</span>
                    <span className="text-xs font-semibold text-gray-300">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Earned By */}
                <div className="border-t border-gray-700 pt-3">
                  <div className="text-xs text-gray-400 mb-2">
                    Earned by {earnedBy.length} {earnedBy.length === 1 ? "member" : "members"}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {earnedBy.length === 0 ? (
                      <span className="text-gray-500 text-sm">No one yet</span>
                    ) : (
                      earnedBy.map(member => (
                        <Link
                          key={member.characterName}
                          to={`/member/${encodeURIComponent(member.characterName)}`}
                          className="text-xs px-2 py-1 bg-blue-900 bg-opacity-50 text-blue-300 rounded hover:bg-opacity-70 transition-colors"
                        >
                          {member.characterName}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No achievements found in this category.
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function MemberProfile() {
  const { characterName } = useParams();
  const [member, setMember] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/data/members.json").then(res => res.json()),
      fetch("/data/achievements.json").then(res => res.json())
    ]).then(([membersData, achievementsData]) => {
      const found = membersData.find(m => m.characterName === decodeURIComponent(characterName));
      setMember(found || null);
      setAchievements(achievementsData);
      setLoading(false);
    });
  }, [characterName]);

  const getClassColor = (className) => {
    const colors = {
      'Warrior': 'class-warrior',
      'Paladin': 'class-paladin',
      'Hunter': 'class-hunter',
      'Rogue': 'class-rogue',
      'Priest': 'class-priest',
      'Death Knight': 'class-death-knight',
      'Shaman': 'class-shaman',
      'Mage': 'class-mage',
      'Warlock': 'class-warlock',
      'Druid': 'class-druid'
    };
    return colors[className] || 'text-gray-300';
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

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Member Not Found</h1>
          <p className="text-gray-400 mb-6">The character you're looking for doesn't exist in our records.</p>
          <Link to="/leaderboard" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            ← Back to Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const memberAchievements = member.achievements.map(name => 
    achievements.find(a => a.name === name)
  ).filter(Boolean);
  const total = memberAchievements.reduce((sum, ach) => sum + (ach.points || 0), 0);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/leaderboard" className="text-yellow-400 hover:text-yellow-300 mb-4 inline-block">
          ← Back to Leaderboard
        </Link>

        {/* Profile Header */}
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-gray-700 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-600 flex-shrink-0">
            <span className="text-5xl">⚔️</span>
          </div>

          {/* Character Info */}
          <div className="flex-1">
            <h1 className={`text-4xl font-bold mb-1 ${getClassColor(member.class)}`}>
              {member.characterName}
            </h1>
            {/* Guild Rank */}
            <div className="text-yellow-400 text-lg font-semibold mb-2">
              {member.guildRank || "No Rank"}
            </div>
            {/* Class and Race */}
            <div className="flex items-center gap-4 text-gray-300">
              <span className={`text-xl ${getClassColor(member.class)}`}>
                {member.class}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-lg">{member.race}</span>
            </div>
          </div>

          {/* Total Points */}
          <div className="text-right">
            <div className="text-gray-400 text-sm mb-1">Total Points</div>
            <div className="text-4xl font-bold text-yellow-400">{total}</div>
          </div>
        </div>
      </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <div className="text-gray-400 text-sm mb-1">Honorable Kills</div>
            <div className="text-3xl font-bold text-red-400">{member.stats.hk}</div>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <div className="text-gray-400 text-sm mb-1">Quests Completed</div>
            <div className="text-3xl font-bold text-yellow-400">{member.stats.questsCompleted}</div>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <div className="text-gray-400 text-sm mb-1">Raids Attended</div>
            <div className="text-3xl font-bold text-orange-400">{member.stats.raidsAttended || 0}</div>
          </div>
        </div>

        {/* Collection Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🐾</span>
              <div>
                <div className="text-gray-400 text-sm">Pets Collected</div>
                <div className="text-3xl font-bold text-pink-400">{member.pets?.length || 0}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👑</span>
              <div>
                <div className="text-gray-400 text-sm">Titles Earned</div>
                <div className="text-3xl font-bold text-purple-400">{member.titles?.length || 0}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⭐</span>
              <div>
                <div className="text-gray-400 text-sm">Factions Exalted</div>
                <div className="text-3xl font-bold text-green-400">{member.factionsExalted?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Pets Section */}
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🐾</span>
              Pets ({member.pets?.length || 0})
            </h2>
            {!member.pets || member.pets.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">No pets collected yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {member.pets.map((pet, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 bg-opacity-50 rounded-lg p-3 border border-gray-600 hover:border-pink-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🐾</span>
                      <span className="text-white font-medium">{pet}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Titles Section */}
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>👑</span>
              Titles ({member.titles?.length || 0})
            </h2>
            {!member.titles || member.titles.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">No titles earned yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {member.titles.map((title, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 bg-opacity-50 rounded-lg p-3 border border-gray-600 hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👑</span>
                      <span className="text-purple-300 font-medium italic">
                        {title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Factions Section */}
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>⭐</span>
              Factions Exalted ({member.factionsExalted?.length || 0})
            </h2>
            {!member.factionsExalted || member.factionsExalted.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">No factions exalted yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {member.factionsExalted.map((faction, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 bg-opacity-50 rounded-lg p-3 border border-gray-600 hover:border-green-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⭐</span>
                      <span className="text-green-300 font-medium">{faction}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            Achievements ({memberAchievements.length})
          </h2>
          {memberAchievements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg mb-2">No achievements earned yet.</p>
              <p className="text-sm">Keep playing to unlock achievements!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memberAchievements.map(achievement => (
                <div
                  key={achievement.name}
                  className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600 hover:border-yellow-500 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded border ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-yellow-900 bg-opacity-50 text-yellow-300 rounded border border-yellow-700">
                          {achievement.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [members, setMembers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/members.json").then(res => res.json()),
      fetch("/data/achievements.json").then(res => res.json())
    ]).then(([membersData, achievementsData]) => {
      setMembers(membersData);
      setAchievements(achievementsData);
      
      // Calculate guild stats
      const totals = membersData.reduce((acc, member) => {
        const memberAchievements = member.achievements.map(name => 
          achievementsData.find(a => a.name === name)
        ).filter(Boolean);
        const memberPoints = memberAchievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
        
        return {
          hk: acc.hk + member.stats.hk,
          quests: acc.quests + member.stats.questsCompleted,
          raids: acc.raids + (member.stats.raidsAttended || 0),
          total: acc.total + memberPoints,
          pets: acc.pets + (member.pets?.length || 0),
          titles: acc.titles + (member.titles?.length || 0),
          factions: acc.factions + (member.factionsExalted?.length || 0)
        };
      }, { hk: 0, quests: 0, raids: 0, total: 0, pets: 0, titles: 0, factions: 0 });
      setStats(totals);
    });
  }, []);

  const topMembers = [...members].sort((a, b) => {
    const aAchievements = a.achievements.map(name => 
      achievements.find(ach => ach.name === name)
    ).filter(Boolean);
    const bAchievements = b.achievements.map(name => 
      achievements.find(ach => ach.name === name)
    ).filter(Boolean);
    const aPoints = aAchievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
    const bPoints = bAchievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
    return bPoints - aPoints;
  }).slice(0, 5);

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

  const totalAchievementsEarned = members.reduce((acc, member) => acc + member.achievements.length, 0);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
            Level One Lunatics
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Challenge Guild on Turtle WoW
          </p>
          <p className="text-gray-400">
            Tracking achievements, leaderboards, and guild statistics
          </p>
        </div>

        {/* Guild Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <div className="text-gray-400 text-sm mb-1">Total Members</div>
              <div className="text-3xl font-bold text-yellow-400">{members.length}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <div className="text-gray-400 text-sm mb-1">Total Points</div>
              <div className="text-3xl font-bold text-green-400">{stats.total}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <div className="text-gray-400 text-sm mb-1">Achievements</div>
              <div className="text-3xl font-bold text-blue-400">{totalAchievementsEarned}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <span>🐾</span>
                <span>Pets Collected</span>
              </div>
              <div className="text-3xl font-bold text-pink-400">{stats.pets}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <span>👑</span>
                <span>Titles Earned</span>
              </div>
              <div className="text-3xl font-bold text-purple-400">{stats.titles}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <span>⭐</span>
                <span>Factions Exalted</span>
              </div>
              <div className="text-3xl font-bold text-green-400">{stats.factions}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <div className="text-gray-400 text-sm mb-1">Total Quests</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.quests}</div>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Guild Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Honorable Kills</span>
                  <span className="text-red-400 font-bold text-lg">{stats.hk}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Quests Completed</span>
                  <span className="text-yellow-400 font-bold text-lg">{stats.quests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Raids Attended</span>
                  <span className="text-orange-400 font-bold text-lg">{stats.raids}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Top 5 Players</h2>
              <div className="space-y-2">
                {topMembers.map((member, index) => {
                  const total = member.stats.hk + member.stats.questsCompleted + (member.stats.raidsAttended || 0);
                  return (
                    <Link
                      key={member.characterName}
                      to={`/member/${encodeURIComponent(member.characterName)}`}
                      className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-50 rounded hover:bg-opacity-70 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400 font-bold w-6">#{index + 1}</span>
                        <span className={`font-semibold ${getClassColor(member.class)} group-hover:text-yellow-400 transition-colors`}>
                          {member.characterName}
                        </span>
                        <span className="text-gray-400 text-sm">{member.class}</span>
                      </div>
                      <span className="text-white font-bold">{total} pts</span>
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/leaderboard"
                className="block mt-4 text-center text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                View Full Leaderboard →
              </Link>
            </div>
          </div>
        )}

        {/* Achievements Preview */}
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Available Achievements</h2>
            <Link
              to="/achievements"
              className="text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.slice(0, 3).map(achievement => {
              const earnedBy = members.filter(m => m.achievements.includes(achievement.name)).length;
              return (
                <div
                  key={achievement.name}
                  className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600 hover:border-yellow-500 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-blue-900 bg-opacity-50 rounded text-blue-300">
                          {achievement.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {earnedBy} {earnedBy === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

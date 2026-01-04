import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const [members, setMembers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [sortField, setSortField] = useState("total");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    Promise.all([
      fetch("/data/members.json").then(res => res.json()),
      fetch("/data/achievements.json").then(res => res.json())
    ]).then(([membersData, achievementsData]) => {
      setMembers(membersData);
      setAchievements(achievementsData);
    });
  }, []);

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    let aValue, bValue;

    if (sortField === "total") {
      const aAchievements = a.achievements.map(name => 
        achievements.find(ach => ach.name === name)
      ).filter(Boolean);
      const bAchievements = b.achievements.map(name => 
        achievements.find(ach => ach.name === name)
      ).filter(Boolean);
      aValue = aAchievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
      bValue = bAchievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
    } else if (sortField === "name") {
      aValue = a.characterName.toLowerCase();
      bValue = b.characterName.toLowerCase();
    } else {
      aValue = a.stats[sortField] || 0;
      bValue = b.stats[sortField] || 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortButton = ({ field, label }) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className={`px-3 py-2 text-left font-semibold text-white hover:text-yellow-400 transition-colors flex items-center gap-1 ${
          isActive ? "text-yellow-400" : ""
        }`}
      >
        {label}
        {isActive && (
          <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Guild Leaderboard</h1>
          <p className="text-gray-400">Click column headers to sort • Click names to view profiles</p>
        </div>

        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 bg-opacity-80 border-b border-gray-700">
                  <th className="px-4 py-4 text-left">
                    <span className="text-gray-300 font-semibold">Rank</span>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <SortButton field="name" label="Name" />
                  </th>
                  <th className="px-4 py-4 text-left">
                    <span className="text-gray-300 font-semibold">Class</span>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <SortButton field="hk" label="HK" />
                  </th>
                  <th className="px-4 py-4 text-left">
                    <SortButton field="questsCompleted" label="Quests" />
                  </th>
                  <th className="px-4 py-4 text-left">
                    <SortButton field="raidsAttended" label="Raids" />
                  </th>
                  <th className="px-4 py-4 text-left">
                    <span className="text-gray-300 font-semibold">🐾 Pets</span>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <span className="text-gray-300 font-semibold">👑 Titles</span>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <span className="text-gray-300 font-semibold">⭐ Factions</span>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <SortButton field="total" label="Total" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((member, index) => {
                  const memberAchievements = member.achievements.map(name => 
                    achievements.find(ach => ach.name === name)
                  ).filter(Boolean);
                  const total = memberAchievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
                  const rank = index + 1;
                  
                  // Determine rank badge color
                  let rankColor = "text-gray-400";
                  if (rank === 1) rankColor = "text-yellow-400";
                  else if (rank === 2) rankColor = "text-gray-300";
                  else if (rank === 3) rankColor = "text-orange-400";

                  return (
                    <tr
                      key={member.characterName}
                      className="border-b border-gray-700 hover:bg-gray-700 bg-opacity-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <span className={`font-bold text-lg ${rankColor}`}>
                          #{rank}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/member/${encodeURIComponent(member.characterName)}`}
                          className={`font-semibold ${getClassColor(member.class)} hover:text-yellow-400 transition-colors`}
                        >
                          {member.characterName}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`${getClassColor(member.class)}`}>
                          {member.class}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-red-300">{member.stats.hk}</td>
                      <td className="px-4 py-4 text-yellow-300">{member.stats.questsCompleted}</td>
                      <td className="px-4 py-4 text-orange-300">{member.stats.raidsAttended || 0}</td>
                      <td className="px-4 py-4 text-pink-300">{member.pets?.length || 0}</td>
                      <td className="px-4 py-4 text-purple-300">{member.titles?.length || 0}</td>
                      <td className="px-4 py-4 text-green-300">{member.factionsExalted?.length || 0}</td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-white text-lg">{total}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {sortedMembers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No members found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}

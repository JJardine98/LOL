import Header from "../components/Header";
import Leaderboard from "../components/Leaderboard";
import Achievements from "../components/Achievements";
import MemberProfile from "../components/MemberProfile";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/member/:characterName" element={<MemberProfile />} />
      </Routes>
    </Router>
  );
}

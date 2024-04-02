import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./output.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./pages/Homepage";
import CreateTeam from "./pages/CreateTeam";

import TeamsPage from "./pages/TeamsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create_team" element={<CreateTeam />} />
        <Route path="/teams" element={<TeamsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

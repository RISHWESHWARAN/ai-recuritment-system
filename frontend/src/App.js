import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateJob from "./pages/CreateJob";
import ViewJob from "./pages/ViewJob";
import UploadResume from "./pages/UploadResume";
import JobDetails from "./pages/JobDetails";
import ManageJobs from "./pages/ManageJobs";
import EvaluateResume from "./pages/EvaluateResume";
import EditJob from "./pages/EditJob";

// 🔥 NEW IMPORTS
import FeedbackPage from "./pages/FeedbackPage";
import AIChat from "./pages/AIChat";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/jobs" element={<ViewJob />} />
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/manage-jobs" element={<ManageJobs />} />
        <Route path="/evaluate" element={<EvaluateResume />} />
        <Route path="/edit-job" element={<EditJob />} />

        {/* 🔥 ADD THESE */}
        <Route path="/feedback/:id" element={<FeedbackPage />} />
        <Route path="/ai-chat" element={<AIChat />} />

      </Routes>
    </Router>
  );
}

export default App;
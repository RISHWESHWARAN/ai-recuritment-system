import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function JobDetails() {
  const { state } = useLocation();
  const job = state?.job;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const [isRejected, setIsRejected] = useState(false);

  // safety check
  if (!job) return <p>No job selected</p>;

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("Please login first");
      return;
    }

    setLoading(true);
    setStatus("Evaluating resume...");

    setTimeout(() => setStatus("Scoring..."), 1500);

    try {
      const res = await fetch(
        `http://localhost:8000/applications/apply/${job.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setStatus("Error");
        return;
      }

      // store application id
      setApplicationId(data.application_id);

      if (data.status === "accepted") {
        setStatus("Application Selected ✅");
      } else {
        setStatus(`Rejected ❌ (Score: ${data.similarity_score.toFixed(2)})`);
        setIsRejected(true);
      }

    } catch (err) {
      console.error(err);
      setLoading(false);
      setStatus("Network error");
    }
  };

  return (
    <div style={{ width: "600px", margin: "50px auto" }}>
      <h2>{job.title}</h2>

      <p style={{ fontWeight: "bold" }}>
        {job.description}
      </p>

      {/* APPLY BUTTON */}
      <button 
        onClick={handleApply} 
        disabled={loading || status.includes("Selected")}
      >
        {status.includes("Selected") ? "Application Selected" : "Apply"}
      </button>

      {/* LOADING SPINNER */}
      {loading && <div style={styles.spinner}></div>}

      {/* STATUS */}
      <p>{status}</p>

      {/* 🔥 AI FEEDBACK BUTTON (THIS IS WHERE IT GOES) */}
      {isRejected && applicationId && (
        <button
          onClick={() => navigate(`/feedback/${applicationId}`)}
          style={{ marginTop: "10px" }}
        >
          View AI Feedback
        </button>
      )}
    </div>
  );
}

// simple spinner style
const styles = {
  spinner: {
    marginTop: "10px",
    width: "30px",
    height: "30px",
    border: "4px solid #ccc",
    borderTop: "4px solid black",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};
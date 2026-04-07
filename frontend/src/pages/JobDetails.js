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
  if (!job) {
    return (
      <div style={styles.errorPage}>
        <h2>No job selected</h2>
        <button onClick={() => navigate("/")} style={styles.backButton}>Go Back</button>
      </div>
    );
  }

  // ==========================================
  // ⚙️ BACKEND LOGIC (100% UNTOUCHED)
  // ==========================================
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

  // ==========================================
  // 🎨 MASSIVELY UPGRADED UI
  // ==========================================
  
  // Dynamic styling helpers based on your status strings
  const isSelected = status.includes("Selected");
  const isError = status.includes("Error") || status.includes("login");

  return (
    <div style={styles.page}>
      {/* CSS Animations */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
      `}</style>

      <div style={styles.container}>
        
        {/* Top Navigation */}
        <button onClick={() => navigate(-1)} style={styles.navBack}>
          &larr; Back to Jobs
        </button>

        <div style={styles.layout}>
          
          {/* LEFT COLUMN: Job Description */}
          <div style={styles.leftColumn}>
            <div style={styles.header}>
              <h1 style={styles.jobTitle}>{job.title}</h1>
              {job.company && <p style={styles.company}>@ {job.company}</p>}
            </div>

            <hr style={styles.divider} />

            <h3 style={styles.sectionTitle}>Role Overview</h3>
            <p style={styles.description}>
              {job.description}
            </p>
          </div>

          {/* RIGHT COLUMN: AI Evaluator Panel */}
          <div style={styles.rightColumn}>
            <div style={styles.evaluatorCard}>
              
              <div style={styles.cardHeader}>
                <span style={{ fontSize: "24px" }}>🤖</span>
                <h3 style={{ margin: 0, fontSize: "18px" }}>AI Recruiter</h3>
              </div>
              
              <p style={styles.cardText}>
                Run your resume through our AI matching engine to see if you qualify for the <b>{job.title}</b> role.
              </p>

              {/* DYNAMIC STATUS DISPLAY */}
              {status && (
                <div style={{
                  ...styles.statusBox,
                  backgroundColor: isSelected ? "#ecfdf5" : isRejected ? "#fef2f2" : isError ? "#fffbeb" : "#f0f9ff",
                  color: isSelected ? "#059669" : isRejected ? "#dc2626" : isError ? "#d97706" : "#0284c7",
                  border: `1px solid ${isSelected ? "#10b981" : isRejected ? "#ef4444" : isError ? "#f59e0b" : "#38bdf8"}`
                }}>
                  {loading && <div style={styles.spinner}></div>}
                  <span style={{ animation: loading ? "pulse 1.5s infinite" : "none", fontWeight: "600" }}>
                    {status}
                  </span>
                </div>
              )}

              {/* MAIN APPLY BUTTON */}
              {!isSelected && !isRejected && (
                <button 
                  onClick={handleApply} 
                  disabled={loading}
                  style={{
                    ...styles.applyBtn,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Scanning Profile..." : "Evaluate & Apply"}
                </button>
              )}

              {/* AI FEEDBACK REVEAL BUTTON */}
              {isRejected && applicationId && (
                <div style={styles.feedbackWrapper}>
                  <p style={styles.feedbackText}>Want to know why you missed the mark?</p>
                  <button
                    onClick={() => navigate(`/feedback/${applicationId}`)}
                    style={styles.feedbackBtn}
                  >
                    ✨ View Detailed AI Feedback
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// 💅 STYLES OBJECT
// ==========================================
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fafafa",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "40px 20px"
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  errorPage: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "sans-serif"
  },
  navBack: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "30px",
    padding: "0",
  },
  layout: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },
  leftColumn: {
    flex: "2",
    minWidth: "320px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  header: {
    marginBottom: "20px"
  },
  jobTitle: {
    margin: "0 0 5px 0",
    fontSize: "36px",
    fontWeight: "800",
    color: "#111",
    textTransform: "capitalize",
    letterSpacing: "-0.5px"
  },
  company: {
    margin: 0,
    fontSize: "18px",
    color: "#666",
    fontWeight: "500"
  },
  divider: {
    border: "none",
    height: "1px",
    backgroundColor: "#eaeaea",
    margin: "30px 0"
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#111",
    marginBottom: "15px"
  },
  description: {
    lineHeight: "1.8",
    color: "#444",
    fontSize: "16px",
    whiteSpace: "pre-wrap",
  },
  rightColumn: {
    flex: "1",
    minWidth: "320px",
    position: "sticky",
    top: "40px"
  },
  evaluatorCard: {
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid #333",
    paddingBottom: "15px",
    marginBottom: "20px"
  },
  cardText: {
    color: "#aaa",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "25px"
  },
  statusBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "15px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(0,0,0,0.1)",
    borderTop: "3px solid currentColor",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  applyBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    transition: "transform 0.1s"
  },
  feedbackWrapper: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px dashed #444",
    textAlign: "center"
  },
  feedbackText: {
    color: "#888",
    fontSize: "13px",
    marginBottom: "12px"
  },
  feedbackBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
  },
  backButton: {
    padding: "10px 20px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};
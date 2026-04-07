import { useNavigate } from "react-router-dom";

export default function CandidatePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the storage so Home.js knows we are logged out
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    // Redirect to home and force a reload to clear the React state
    navigate("/");
    window.location.reload(); 
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: "30px" }}>Candidate Dashboard</h2>
      
      <div style={styles.buttonGroup}>
        <button style={styles.button3D} onClick={() => navigate("/jobs")}>
          Explore Jobs
        </button>
        <button style={styles.button3D} onClick={() => navigate("/upload-resume")}>
          Upload Resume
        </button>
        {/* 🔥 Updated Evaluate Button */}
        <button style={styles.button3D} onClick={() => navigate("/evaluate")}>
          Evaluate Resume
        </button>
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center", 
    marginTop: "100px",
    fontFamily: "Arial, sans-serif"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    margin: "20px 0",
    flexWrap: "wrap" // Ensures it looks good on smaller screens
  },
  // The Black 3D Style
  button3D: {
    padding: "12px 24px",
    background: "#000",
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 4px 0 #444", // The 3D effect
    transition: "transform 0.1s, box-shadow 0.1s",
  },
  logoutButton: {
    padding: "10px 20px",
    background: "#dc3545", 
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "60px",
    fontWeight: "bold",
    opacity: 0.9
  }
};
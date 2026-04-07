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
      <h2>Candidate Dashboard</h2>
      
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => navigate("/jobs")}>
          Explore Jobs
        </button>
        <button style={styles.button} onClick={() => navigate("/upload-resume")}>
          Upload Resume
        </button>
        <button onClick={() => navigate("/evaluate")}>
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
    marginTop: "100px" 
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    margin: "20px 0"
  },
  button: {
    padding: "10px 20px",
    background: "#000",
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  logoutButton: {
    padding: "10px 20px",
    background: "#dc3545", // Red color to indicate logout
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "40px",
  }
};
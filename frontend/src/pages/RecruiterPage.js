import { useNavigate } from "react-router-dom";

export default function RecruiterHome() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome back, Recruiter</h1>
        <p style={styles.subtitle}>Manage your talent pipeline</p>
      </header>

      <div style={styles.dashboardGrid}>
        {/* 🔥 Card 1: Post Job */}
        <div style={styles.card}>
          <div style={styles.icon}>➕</div>
          <h3 style={styles.cardTitle}>New Opportunity</h3>
          <p style={styles.cardText}>
            Define roles, set requirements, and find your next star hire.
          </p>
          <button style={styles.button3D} onClick={() => navigate("/create-job")}>
            Post Job
          </button>
        </div>

        {/* 🔥 Card 2: Modify Jobs */}
        <div style={styles.card}>
          <div style={styles.icon}>📋</div>
          <h3 style={styles.cardTitle}>Live Listings</h3>
          <p style={styles.cardText}>
            Edit open positions, check applicant flow, or close roles.
          </p>
          <button style={styles.button3D} onClick={() => navigate("/manage-jobs")}>
            Modify Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "80px auto 50px auto", // Adjusted top margin
    padding: "0 20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  },
  header: {
    marginBottom: "50px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0",
    letterSpacing: "-1px"
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
    marginTop: "5px"
  },
  dashboardGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "20px",
    flexWrap: "wrap"
  },
  // Creative Card Style
  card: {
    background: "#fff",
    border: "1px solid #eaeaea",
    borderRadius: "20px",
    padding: "30px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
    cursor: "default"
  },
  icon: {
    fontSize: "40px",
    marginBottom: "20px"
  },
  cardTitle: {
    margin: "0 0 10px 0",
    fontSize: "20px",
    fontWeight: "bold"
  },
  cardText: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "25px",
    lineHeight: "1.5",
    flex: 1 // Keeps the button at the bottom of the card
  },
  // 🔥 The Black 3D Button Style
  button3D: {
    width: "100%", // Full width inside the card
    padding: "12px 20px",
    background: "#000",
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 4px 0 #444", // The 3D effect
    transition: "transform 0.1s, box-shadow 0.1s",
    display: "block" // Ensures margin auto works if width isn't 100%
  },
};
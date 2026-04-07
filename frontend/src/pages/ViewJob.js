import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewJob() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Backend logic remains 100% untouched!
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  return (
    <div style={styles.page}>
      
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Find Your Next Role</h1>
          <p style={styles.heroSub}>
            Browse available positions and use our <b>AI Evaluator</b> to see how well your resume matches.
          </p>
        </div>
      </div>

      {/* Job Board Container */}
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.sectionTitle}>Latest Openings</h2>
          <span style={styles.jobCount}>{jobs.length} roles found</span>
        </div>

        {jobs.length === 0 ? (
          <div style={styles.loading}>Searching for roles...</div>
        ) : (
          <div style={styles.grid}>
            {jobs.map((job) => (
              <div key={job.id} style={styles.card}>
                
                {/* Top Half: Company Info */}
                <div style={styles.cardHeader}>
                  <div style={styles.companyBadge}>
                    {job.company ? job.company.charAt(0).toUpperCase() : "💼"}
                  </div>
                  <div>
                    <h3 style={styles.company}>{job.company}</h3>
                    <p style={styles.title}>{job.title}</p>
                  </div>
                </div>

                {/* Bottom Half: Action */}
                <div style={styles.cardFooter}>
                  <span style={styles.tag}>✨ AI Evaluate</span>
                  <button
                    style={styles.button}
                    onClick={() => navigate("/job-details", { state: { job } })}
                    onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
                    onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
                  >
                    View Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f7f6",
    fontFamily: "'Inter', sans-serif",
  },
  hero: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "60px 20px",
    textAlign: "center",
    borderBottom: "4px solid #4facfe"
  },
  heroContent: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  heroTitle: {
    margin: "0 0 15px 0",
    fontSize: "36px",
    fontWeight: "800",
    letterSpacing: "-1px"
  },
  heroSub: {
    margin: "0",
    fontSize: "16px",
    color: "#aaa",
    lineHeight: "1.5"
  },
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#111"
  },
  jobCount: {
    fontSize: "14px",
    color: "#666",
    backgroundColor: "#e2e8f0",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600"
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    color: "#666",
    fontSize: "16px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  card: {
    padding: "24px",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #eaeaea",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px"
  },
  companyBadge: {
    width: "50px",
    height: "50px",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },
  company: {
    margin: "0 0 4px 0",
    fontWeight: "700",
    color: "#111",
    fontSize: "18px"
  },
  title: {
    margin: 0,
    color: "#555",
    fontSize: "15px"
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "20px"
  },
  tag: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#4facfe",
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    padding: "6px 10px",
    borderRadius: "6px"
  },
  button: {
    padding: "10px 16px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "transform 0.2s ease, background 0.2s ease"
  }
};
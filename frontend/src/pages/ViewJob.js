import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewJob() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  return (
    <div style={{ width: "500px", margin: "50px auto" }}>
      <h2>Available Jobs</h2>

      {jobs.map((job) => (
        <div key={job.id} style={styles.card}>
          <h3 style={styles.company}>{job.company}</h3>
          <p style={styles.title}>{job.title}</p>

          {/* ONLY CHANGE HERE */}
          <button
            style={styles.button}
            onClick={() => navigate("/job-details", { state: { job } })}
          >
            Apply
          </button>

        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "15px",
    background: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
  },
  company: {
    fontWeight: "bold",
    color: "#000",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
  },
  title: {
    marginTop: "5px"
  },
  button: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};
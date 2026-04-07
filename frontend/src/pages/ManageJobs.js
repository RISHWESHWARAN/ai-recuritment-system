import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // 🔥 Fixed URL: Changed back to your original endpoint
      const res = await fetch("http://localhost:8000/jobs"); 
      const data = await res.json();
      
      // 🔥 Safety Net: Ensures data is actually an array before saving it
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error("Backend did not return an array:", data);
        setJobs([]); 
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;

    try {
      const res = await fetch(`http://localhost:8000/jobs/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        alert("Deleted");
        fetchJobs(); // Refresh the list after deleting
      } else {
        const data = await res.json();
        alert(data.detail || "Delete failed");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backLink} onClick={() => navigate("/recruiter")}>
          ← Back to Dashboard
        </button>
        <h2 style={styles.title}>Manage Job Listings</h2>
        <p style={styles.subtitle}>View, edit, or remove your active opportunities</p>
      </div>

      {loading ? (
        <p style={styles.emptyState}>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No jobs posted yet.</p>
          <button style={styles.button3D} onClick={() => navigate("/create-job")}>
            Post Your First Job
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.jobInfo}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.jobMeta}>Cutoff: {job.cutoff_score}</p>
              </div>
              
              <div style={styles.actionGroup}>
                <button 
                  style={styles.editBtn} 
                  onClick={() => navigate("/edit-job", { state: { job } })}
                >
                  Edit
                </button>
                <button 
                  style={styles.deleteBtn} 
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "80px auto",
    padding: "0 20px",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  backLink: {
    background: "none",
    border: "none",
    color: "#666",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
    marginBottom: "10px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "10px 0 5px 0"
  },
  subtitle: {
    color: "#888",
    fontSize: "16px"
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  jobCard: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "16px",
    padding: "20px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
    transition: "transform 0.2s"
  },
  jobInfo: {
    textAlign: "left"
  },
  jobTitle: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "bold",
    textTransform: "capitalize"
  },
  jobMeta: {
    margin: "5px 0 0 0",
    fontSize: "13px",
    color: "#999"
  },
  actionGroup: {
    display: "flex",
    gap: "10px"
  },
  editBtn: {
    padding: "8px 16px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0 3px 0 #444" 
  },
  deleteBtn: {
    padding: "8px 16px",
    background: "#fff",
    color: "#dc3545",
    border: "1px solid #dc3545",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px"
  },
  emptyState: {
    marginTop: "50px",
    textAlign: "center",
    color: "#666"
  },
  button3D: {
    padding: "12px 24px",
    background: "#000",
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 0 #444",
    marginTop: "15px"
  }
};
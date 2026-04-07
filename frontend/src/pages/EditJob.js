import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EditJob() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const job = state?.job;

  // Fallback to empty strings if state is missing to prevent crashes
  const [title, setTitle] = useState(job?.title || "");
  const [description, setDescription] = useState(job?.description || "");
  const [cutoff, setCutoff] = useState(job?.cutoff_score || 0.7);
  const [isUpdating, setIsUpdating] = useState(false);

  const token = localStorage.getItem("token");

  const handleUpdate = async () => {
    if (!title || !description) return alert("Fields cannot be empty");
    
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:8000/jobs/update/${job.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          cutoff_score: cutoff
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Update failed");
        return;
      }

      alert("✨ Job updated successfully!");
      navigate("/manage-jobs"); // Take them back to the list
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <button style={styles.backLink} onClick={() => navigate("/manage-jobs")}>
          ← Back to Manage Jobs
        </button>
        
        <h2 style={styles.title}>Edit Listing</h2>
        <p style={styles.subtitle}>Modify the job details or AI suitability threshold</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={styles.textarea}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Suitability Cutoff</label>
          <select
            value={cutoff}
            onChange={(e) => setCutoff(parseFloat(e.target.value))}
            style={styles.select}
          >
            <option value={0.9}>0.9 - Highly Suitable</option>
            <option value={0.8}>0.8 - Strong Match</option>
            <option value={0.7}>0.7 - Good Fit</option>
            <option value={0.5}>0.5 - Average</option>
            <option value={0.3}>0.3 - Low Fit</option>
          </select>
        </div>

        <button 
          style={isUpdating ? styles.buttonDisabled : styles.button3D} 
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f4f4",
    padding: "20px"
  },
  formCard: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    position: "relative"
  },
  backLink: {
    background: "none",
    border: "none",
    color: "#666",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
    padding: "0",
    textDecoration: "underline"
  },
  title: {
    margin: "0 0 5px 0",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center"
  },
  subtitle: {
    color: "#888",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "30px"
  },
  inputGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "15px"
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "none"
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#fff",
    boxSizing: "border-box"
  },
  button3D: {
    width: "100%",
    padding: "15px",
    background: "#000",
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 0 #333",
    marginTop: "10px"
  },
  buttonDisabled: {
    width: "100%",
    padding: "15px",
    background: "#ccc",
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    marginTop: "10px"
  }
};
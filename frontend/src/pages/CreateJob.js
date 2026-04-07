import { useState } from "react";

export default function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cutoff, setCutoff] = useState(0.7); // Default to a reasonable 'Good Fit'
  const [isPosting, setIsPosting] = useState(false);

  const handleCreateJob = async () => {
    const token = localStorage.getItem("token");
    if (!title || !description) return alert("Please fill in all fields");

    setIsPosting(true);

    try {
      const res = await fetch("http://localhost:8000/jobs/create", {
        method: "POST",
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
        alert(data.detail || "Error");
        return;
      }

      alert("🚀 Job created successfully!");
      setTitle("");
      setDescription("");
      setCutoff(0.7);

    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Create New Listing</h2>
        <p style={styles.subtitle}>Define the requirements for your next hire</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Title</label>
          <input
            placeholder="e.g. Senior AI Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Description</label>
          <textarea
            placeholder="Describe the role, responsibilities, and required stack..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Suitability Cutoff (AI Match)</label>
          <select
            value={cutoff}
            onChange={(e) => setCutoff(parseFloat(e.target.value))}
            style={styles.select}
          >
            <option value={0.9}>0.9 - Highly Suitable (Elite)</option>
            <option value={0.8}>0.8 - Strong Match (Qualified)</option>
            <option value={0.7}>0.7 - Good Fit (Standard)</option>
            <option value={0.5}>0.5 - Average (Flexible)</option>
            <option value={0.3}>0.3 - Low Fit (All Applicants)</option>
          </select>
          <small style={styles.hint}>Candidates below this score will be flagged as "Not Suitable".</small>
        </div>

        <button 
          style={isPosting ? styles.buttonDisabled : styles.button3D} 
          onClick={handleCreateJob}
          disabled={isPosting}
        >
          {isPosting ? "Posting..." : "Create Job"}
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
    background: "#f9f9f9",
    padding: "20px"
  },
  formCard: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
    textAlign: "left"
  },
  title: {
    margin: "0 0 5px 0",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center"
  },
  subtitle: {
    color: "#666",
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
    marginBottom: "8px",
    color: "#333"
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    resize: "none",
    boxSizing: "border-box"
  },
  select: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "15px",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box"
  },
  hint: {
    display: "block",
    marginTop: "5px",
    fontSize: "12px",
    color: "#999"
  },
  button3D: {
    width: "100%",
    padding: "15px",
    background: "#000",
    color: "#fff",
    borderRadius: "15px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 0 #444",
    marginTop: "10px",
    transition: "transform 0.1s"
  },
  buttonDisabled: {
    width: "100%",
    padding: "15px",
    background: "#ccc",
    color: "#fff",
    borderRadius: "15px",
    border: "none",
    fontSize: "16px",
    marginTop: "10px",
    cursor: "not-allowed"
  }
};
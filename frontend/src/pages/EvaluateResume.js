import { useState } from "react";

export default function EvaluateResume() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [score, setScore] = useState(null);

  const handleEvaluate = async () => {
    const token = localStorage.getItem("token");

    setLoading(true);
    setScore(null);
    setStage("Analyzing resume...");

    setTimeout(() => setStage("Matching with job..."), 1200);
    setTimeout(() => setStage("Calculating score..."), 2200);

    try {
      const res = await fetch("http://localhost:8000/feedback/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description: desc
        })
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setStage("Error");
        return;
      }

      setScore(data.similarity_score);
      setStage("Done");

    } catch (err) {
      console.error(err);
      setLoading(false);
      setStage("Network error");
    }
  };

  return (
    <div style={{ width: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Evaluate Resume</h2>

      <input
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Job Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        style={styles.textarea}
      />

      <button style={styles.button} onClick={handleEvaluate}>
        Evaluate
      </button>

      {loading && (
        <div style={styles.loaderBox}>
          <div style={styles.gear}></div>
          <p>{stage}</p>
        </div>
      )}

      {score !== null && (
        <h3 style={{ marginTop: "20px" }}>
          Score: {score.toFixed(2)}
        </h3>
      )}
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd"
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd"
  },
  button: {
    padding: "10px 15px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  },
  loaderBox: {
    marginTop: "20px"
  },
  gear: {
    width: "50px",
    height: "50px",
    border: "6px solid #ddd",
    borderTop: "6px solid #000",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 0.8s linear infinite"
  }
};
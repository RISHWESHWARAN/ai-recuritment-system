import { useState } from "react";

export default function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cutoff, setCutoff] = useState(5.0);

  const handleCreateJob = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/jobs/create", {
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
      console.log(data);

      if (!res.ok) {
        alert(data.detail || "Error");
        return;
      }

      alert("Job created!");
      setTitle("");
      setDescription("");
      setCutoff(5.0);

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div style={{ width: "400px", margin: "100px auto", textAlign: "center" }}>
      <h2>Create Job</h2>

      <input
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <select
        value={cutoff}
        onChange={(e) => setCutoff(parseFloat(e.target.value))}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
        <option value={0.9}>0.9 - Highly Suitable</option>
        <option value={0.8}>0.8 - Strong Match</option>
        <option value={0.7}>0.7 - Good Fit</option>
        <option value={0.5}>0.5 - Average</option>
        <option value={0.3}>0.3 - Low Fit</option>
      </select>

      <button onClick={handleCreateJob}>Create Job</button>
    </div>
  );
}
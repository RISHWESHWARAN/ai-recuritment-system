import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function EditJob() {
  const { state } = useLocation();
  const job = state?.job;

  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [cutoff, setCutoff] = useState(job.cutoff_score);

  const token = localStorage.getItem("token");

  const handleUpdate = async () => {
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
      alert(data.detail);
      return;
    }

    alert("Updated successfully");
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Edit Job</h2>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      <input
        type="number"
        step="0.1"
        value={cutoff}
        onChange={(e) => setCutoff(parseFloat(e.target.value))}
      />

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
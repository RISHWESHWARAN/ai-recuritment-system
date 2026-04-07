import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // ✅ ADD

  const fetchJobs = () => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ ADD THIS
  const handleEdit = (job) => {
    navigate("/edit-job", { state: { job } });
  };

  const handleDelete = async (jobId) => {
    const res = await fetch(`http://localhost:8000/jobs/delete/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail);
      return;
    }

    alert("Deleted");
    fetchJobs();
  };

  return (
    <div style={{ width: "500px", margin: "50px auto" }}>
      <h2>Manage Jobs</h2>

      {jobs.map((job) => (
        <div key={job.id} style={styles.card}>
          <h3>{job.title}</h3>

          <button onClick={() => handleEdit(job)}>
            Edit
          </button>

          <button onClick={() => handleDelete(job.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)"
  }
};
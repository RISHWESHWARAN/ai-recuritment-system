import { useNavigate } from "react-router-dom";

export default function RecruiterHome() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Recruiter Dashboard</h2>

      <button onClick={() => navigate("/create-job")}>
        Post Job
      </button>

      <button
        style={{ marginLeft: "10px" }}
        onClick={() => navigate("/manage-jobs")}
      >
        Modify Jobs
      </button>
    </div>
  );
}
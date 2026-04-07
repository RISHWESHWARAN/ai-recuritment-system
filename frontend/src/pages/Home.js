// import CandidateHome from "./CandidatePage";
// import RecruiterHome from "./RecruiterPage";

// export default function Home() {
//   const role = localStorage.getItem("role")?.toLowerCase().trim();

//   console.log("ROLE:", role);

//   if (role === "candidate") return <CandidateHome />;
//   if (role === "recruiter") return <RecruiterHome />;

//   return (
//     <div>
//       <h1>Welcome</h1>
//     </div>
//   );
// }
// const styles = {
//   primary: {
//     background: "#000",
//     color: "#fff",
//     padding: "12px 20px",
//     borderRadius: "10px",
//     border: "none",
//     marginRight: "10px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
//   },
//   secondary: {
//     background: "#eee",
//     padding: "12px 20px",
//     borderRadius: "10px",
//     border: "none"
//   }
// };

import { useNavigate } from "react-router-dom";
import CandidatePage from "./CandidatePage"; // Ensure filename matches exactly
import RecruiterPage from "./RecruiterPage"; // Ensure filename matches exactly

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If there is no token, show the common generic homepage
  if (!token) {
    return (
      <div style={styles.container}>
        <h1>Welcome to the Job Portal</h1>
        <p>Please login or create an account to continue.</p>
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={() => navigate("/login")}>
            Login
          </button>
          <button style={styles.button} onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // If they are logged in, route them based on their role
  if (role === "recruiter") {
    return <RecruiterPage />;
  }

  // Default to Candidate page
  return <CandidatePage />;
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    background: "#000",
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  }
};
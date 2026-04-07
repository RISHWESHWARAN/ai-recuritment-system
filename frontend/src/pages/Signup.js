import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [role, setRole] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role,
          company_name: role === "recruiter" ? company : null
        })
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (!res.ok) {
        alert(data.detail || "Signup failed");
        return;
      }

      navigate("/"); // redirect to home

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>

      <div style={styles.roleBox}>
        <button
          style={role === "candidate" ? styles.active : styles.inactive}
          onClick={() => setRole("candidate")}
        >
          Candidate
        </button>

        <button
          style={role === "recruiter" ? styles.active : styles.inactive}
          onClick={() => setRole("recruiter")}
        >
          Recruiter
        </button>
      </div>

      <input
        placeholder="Email"
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        style={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {role === "recruiter" && (
        <input
          placeholder="Company Name"
          style={styles.input}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      )}

      <button style={styles.submit} onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: "350px",
    margin: "100px auto",
    textAlign: "center"
  },
  roleBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  active: {
    flex: 1,
    background: "#000",
    color: "#fff",
    borderRadius: "12px",
    padding: "10px",
    border: "none"
  },
  inactive: {
    flex: 1,
    background: "#eee",
    borderRadius: "12px",
    padding: "10px",
    border: "none"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "12px",
    border: "1px solid #ddd"
  },
  submit: {
    width: "100%",
    padding: "12px",
    background: "#000",
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    cursor: "pointer"
  }
};
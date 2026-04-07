import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          username: email,
          password: password
        })
      });

      if (!res.ok) {
        alert("Login failed");
        return;
        }

      const data = await res.json();

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
     navigate("/");// redirect to home
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

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

      <button style={styles.submit} onClick={handleLogin}>
        Login
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
    cursor: "pointer",
    position: "relative",
    zIndex: 10
  }
};
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div style={styles.nav}>
      <div style={styles.logo}>AI Recruit</div>
    
      <div style={styles.right}>
        <button style={styles.login}>Sign in</button>

        <button style={styles.login} onClick={() => navigate("/login")}>
         Login
        </button>

        <button style={styles.signup} onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#000",   // 🔥 BLACK NAVBAR
    color: "#fff"
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600"
  },
  right: {
    display: "flex",
    gap: "15px"
  },
  login: {
    background: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer"
  },
  signup: {
    background: "#fff",
    color: "#000",
    padding: "8px 16px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(255,255,255,0.2)" // subtle 3D
  }
};
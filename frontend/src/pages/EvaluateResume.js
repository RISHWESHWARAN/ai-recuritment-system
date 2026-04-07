import { useState } from "react";

export default function EvaluateResume() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [score, setScore] = useState(null);

  // AI CHAT STATE
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // 🔹 SMART SCORE CONVERSION
  // Maps raw SBERT scores (0 to 1) to a more encouraging, human-readable percentage.
  const calculateFitPercentage = (rawScore) => {
    // SBERT scores can be harsh. A multiplier helps map it to standard ATS expectations.
    const percent = Math.floor(rawScore * 115); 
    return Math.min(100, Math.max(0, percent)); // Clamp between 0 and 100
  };

  // Generate dynamic feedback based on the percentage
  const getFeedbackMessage = (percent) => {
    if (percent >= 80) return { text: "Exceptional Match! You are highly competitive for this role.", color: "#10b981" }; // Emerald Green
    if (percent >= 60) return { text: "Solid Potential. A few targeted tweaks could make you a top tier candidate.", color: "#f59e0b" }; // Amber
    return { text: "Moderate Fit. Consider tailoring your experience closer to the job description.", color: "#ef4444" }; // Red
  };

  // 🔹 EVALUATE (ONLY SCORE)
  const handleEvaluate = async () => {
    if (!title || !desc) {
      alert("Please enter both a job title and description.");
      return;
    }

    const token = localStorage.getItem("token");

    setLoading(true);
    setScore(null);
    setShowChat(false); // Hide chat if running a new evaluation

    // Creative, engaging loading states
    setStage("Scanning resume structure...");
    setTimeout(() => setStage("Extracting key industry skills..."), 1000);
    setTimeout(() => setStage("Running NLP semantic matching..."), 2000);
    setTimeout(() => setStage("Finalizing candidate fit..."), 3000);

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
        setStage("Evaluation failed. Please try again.");
        return;
      }

      setScore(data.similarity_score);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setStage("Network error occurred.");
    }
  };

  // 🔹 AUTO AI RESPONSE WHEN CLICKING ASK AI
  const startAI = async () => {
    setShowChat(true);
    setIsTyping(true);
    setChat([]); 

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: "Give me an overall evaluation and how to improve",
          description: desc
        })
      });

      const data = await res.json();
      setChat([{ user: "AI Evaluation", ai: data.reply }]);

    } catch (err) {
      console.error(err);
      setChat([{ user: "System", ai: "AI failed to respond. Is the backend running?" }]);
    } finally {
      setIsTyping(false); 
    }
  };

  // 🔹 SEND MESSAGE
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userText = message;
    const token = localStorage.getItem("token");

    setMessage("");
    setChat(prev => [...prev, { user: userText, ai: null }]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userText,
          description: desc
        })
      });

      const data = await res.json();

      setChat(prev => {
        const newChat = [...prev];
        newChat[newChat.length - 1].ai = data.reply;
        return newChat;
      });

    } catch (err) {
      console.error(err);
      setChat(prev => {
        const newChat = [...prev];
        newChat[newChat.length - 1].ai = "System Error: Failed to fetch response.";
        return newChat;
      });
    } finally {
      setIsTyping(false); 
    }
  };

  // Compute final display variables if we have a score
  const fitPercentage = score !== null ? calculateFitPercentage(score) : null;
  const feedback = fitPercentage !== null ? getFeedbackMessage(fitPercentage) : null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.headerTitle}>AI Resume Evaluator</h2>
        <p style={styles.subtitle}>See how well your resume matches the job description</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Target Job Title</label>
          <input
            placeholder="e.g. Senior Data Analyst"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Description</label>
          <textarea
            placeholder="Paste the key responsibilities and requirements here..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <button 
          style={loading ? { ...styles.mainBtn, ...styles.btnDisabled } : styles.mainBtn} 
          onClick={handleEvaluate}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Evaluate Fit"}
        </button>

        {/* LOADING ANIMATION */}
        {loading && (
          <div style={styles.loaderBox}>
            <div style={styles.spinner}></div>
            <p style={styles.loaderText}>{stage}</p>
          </div>
        )}

        {/* RESULTS SECTION */}
        {score !== null && !loading && (
          <div style={styles.resultsCard}>
            <h3 style={styles.resultsTitle}>Match Results</h3>
            
            <div style={styles.scoreCircleWrapper}>
              <div style={{ ...styles.scoreCircle, borderColor: feedback.color }}>
                <span style={{ ...styles.scoreNumber, color: feedback.color }}>
                  {fitPercentage}%
                </span>
              </div>
            </div>

            <p style={{ ...styles.feedbackText, color: feedback.color }}>
              {feedback.text}
            </p>
            <p style={styles.rawScoreText}>Raw confidence score: {score.toFixed(2)}</p>

            <button style={styles.askAiBtn} onClick={startAI}>
              💡 Ask AI for Tailored Advice
            </button>
          </div>
        )}
      </div>

      {/* 🔥 CHAT PANEL */}
      {showChat && (
        <div style={styles.chatWrapper}>
          <div style={styles.chatHeader}>
            <span style={{ fontSize: "1.1rem" }}>🤖</span> Resume Assistant
            <button style={styles.closeChatBtn} onClick={() => setShowChat(false)}>✖</button>
          </div>

          <div style={styles.chatBody}>
            {chat.map((c, i) => (
              <div key={i} style={styles.messageBlock}>
                {c.user !== "AI Evaluation" && (
                  <div style={styles.userMsg}>{c.user}</div>
                )}
                {c.ai && <div style={styles.aiMsg}>{c.ai}</div>}
              </div>
            ))}
            
            {isTyping && (
              <div style={styles.typingIndicator}>
                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                AI is analyzing...
              </div>
            )}
          </div>

          <div style={styles.chatInputBox}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask how to improve specific skills..."
              style={styles.chatInput}
            />
            <button style={styles.sendBtn} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* CSS for Spinner Animations */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}

// --- STYLES ---
const styles = {
  page: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    paddingTop: "40px",
    backgroundColor: "#fafafa" // Light clean background matching the screenshot edges
  },
  container: {
    width: "100%",
    maxWidth: "550px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #eaeaea",
    textAlign: "center",
    height: "fit-content"
  },
  headerTitle: {
    margin: "0 0 5px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#111"
  },
  subtitle: {
    margin: "0 0 25px 0",
    fontSize: "14px",
    color: "#666"
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: "15px"
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
    marginBottom: "6px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box"
  },
  mainBtn: {
    width: "100%",
    padding: "14px",
    background: "#000",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.2s",
  },
  btnDisabled: {
    background: "#666",
    cursor: "not-allowed"
  },
  loaderBox: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px"
  },
  loaderText: {
    fontSize: "14px",
    color: "#555",
    fontWeight: "500",
    animation: "pulse 1.5s infinite"
  },
  resultsCard: {
    marginTop: "30px",
    padding: "25px",
    background: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #eee"
  },
  resultsTitle: {
    margin: "0 0 20px 0",
    fontSize: "18px",
    color: "#333"
  },
  scoreCircleWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px"
  },
  scoreCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    borderWidth: "6px",
    borderStyle: "solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },
  scoreNumber: {
    fontSize: "32px",
    fontWeight: "800",
  },
  feedbackText: {
    fontSize: "15px",
    fontWeight: "600",
    margin: "0 0 5px 0"
  },
  rawScoreText: {
    fontSize: "12px",
    color: "#888",
    margin: "0 0 20px 0"
  },
  askAiBtn: {
    padding: "12px 20px",
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%"
  },
  
  // 🔥 CHAT PANEL STYLES
  chatWrapper: {
    position: "fixed",
    right: 0,
    top: 0,
    width: "420px",
    height: "100vh",
    background: "#ffffff",
    borderLeft: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-10px 0 30px rgba(0,0,0,0.05)",
    zIndex: 1000
  },
  chatHeader: {
    padding: "20px",
    fontWeight: "700",
    background: "#000",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px"
  },
  closeChatBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px"
  },
  chatBody: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    background: "#f9fafb"
  },
  messageBlock: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: "15px"
  },
  userMsg: {
    background: "#000",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "14px 14px 0 14px",
    alignSelf: "flex-end",
    maxWidth: "80%",
    fontSize: "14px",
    lineHeight: "1.4"
  },
  aiMsg: {
    background: "#fff",
    color: "#333",
    border: "1px solid #e5e7eb",
    padding: "14px 16px",
    borderRadius: "14px 14px 14px 0",
    alignSelf: "flex-start",
    maxWidth: "85%",
    fontSize: "14px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
    marginTop: "5px"
  },
  typingIndicator: {
    alignSelf: "flex-start",
    fontSize: "13px",
    color: "#6b7280",
    fontStyle: "italic",
    padding: "10px",
  },
  chatInputBox: {
    display: "flex",
    padding: "15px",
    background: "#fff",
    borderTop: "1px solid #e5e7eb"
  },
  chatInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginRight: "10px",
    outline: "none",
    fontSize: "14px"
  },
  sendBtn: {
    padding: "0 20px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  }
};
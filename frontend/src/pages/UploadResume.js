import { useState } from "react";

export default function UploadResume() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/resumes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}` // 🔥 We added the token back!
        },
        body: formData 
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.detail || "Error");
        return;
      }

      alert(data.message); 
      
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div style={{ width: "400px", margin: "100px auto", textAlign: "center" }}>
      <h2>Upload Resume (PDF)</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: "15px" }}
      />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}


















































































































































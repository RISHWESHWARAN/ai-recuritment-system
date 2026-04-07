import { useState, useRef } from "react";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  
  const fileInputRef = useRef(null);

  // 🔹 HANDLE FILE SELECTION (Click or Drop)
  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadSuccess(false); // Reset success state if new file is chosen
      
      // ✨ THE MAGIC TRICK: Create a local URL to preview the PDF without hitting the backend
      const objectUrl = URL.createObjectURL(selectedFile);
      setPdfPreviewUrl(objectUrl);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const onFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  // 🔹 DRAG & DROP HANDLERS
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // 🔹 UPLOAD TO BACKEND
  const handleUpload = async () => {
    if (!file) return;

    const token = localStorage.getItem("token");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file); 
    // Note: Make sure "file" matches the exact key your backend expects (e.g., "resume", "pdf", etc.)

    try {
      // ⚠️ UPDATE THIS URL TO YOUR ACTUAL UPLOAD ENDPOINT
      const res = await fetch("http://localhost:8000/resumes/upload", { 
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // Do NOT set Content-Type manually here; the browser sets it automatically with FormData boundaries
        },
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");

      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 OPEN PDF IN NEW TAB
  const viewResume = () => {
    if (pdfPreviewUrl) {
      window.open(pdfPreviewUrl, "_blank");
    }
  };

  // Helper to format file size cleanly
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>📄</div>
          <h2 style={styles.title}>Upload Your Resume</h2>
          <p style={styles.subtitle}>Upload your PDF to let our AI extract and analyze your profile.</p>
        </div>

        {/* DRAG AND DROP ZONE */}
        <div 
          style={{
            ...styles.dropZone,
            borderColor: isDragging ? "#000" : "#e5e7eb",
            backgroundColor: isDragging ? "#f9fafb" : "#ffffff"
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            accept="application/pdf"
            ref={fileInputRef}
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          
          <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p style={styles.dropText}>
            <span style={styles.browseText}>Click to browse</span> or drag and drop
          </p>
          <p style={styles.dropHint}>PDF (Max 5MB)</p>
        </div>

        {/* SELECTED FILE CARD */}
        {file && (
          <div style={styles.fileCard}>
            <div style={styles.fileInfo}>
              <div style={styles.pdfIcon}>PDF</div>
              <div style={styles.fileDetails}>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>{formatFileSize(file.size)}</p>
              </div>
            </div>
            {/* View Preview Button (Available instantly before upload) */}
            <button style={styles.previewBtn} onClick={viewResume} title="Preview Document">
              👁️ View
            </button>
          </div>
        )}

        {/* UPLOAD ACTIONS */}
        {file && !uploadSuccess && (
          <button 
            style={uploading ? { ...styles.uploadBtn, ...styles.btnDisabled } : styles.uploadBtn}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <span style={styles.flexCenter}>
                <div style={styles.spinner}></div> Extracting Text...
              </span>
            ) : (
              "Upload & Parse Resume"
            )}
          </button>
        )}

        {/* SUCCESS STATE */}
        {uploadSuccess && (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <p style={styles.successText}>Resume uploaded and text extracted successfully!</p>
            <button style={styles.continueBtn} onClick={() => window.location.href = '/evaluate'}>
              Continue to Evaluation ➔
            </button>
          </div>
        )}
      </div>

      {/* CSS ANIMATIONS */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
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
    paddingTop: "60px",
    backgroundColor: "#fafafa" 
  },
  container: {
    width: "100%",
    maxWidth: "500px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
    border: "1px solid #eaeaea",
    textAlign: "center",
    height: "fit-content"
  },
  header: {
    marginBottom: "30px"
  },
  iconCircle: {
    width: "50px",
    height: "50px",
    background: "#f3f4f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    margin: "0 auto 15px auto"
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#111"
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5"
  },
  dropZone: {
    border: "2px dashed #e5e7eb",
    borderRadius: "12px",
    padding: "40px 20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "25px"
  },
  uploadIcon: {
    width: "40px",
    height: "40px",
    color: "#9ca3af",
    margin: "0 auto 15px auto"
  },
  dropText: {
    margin: "0 0 5px 0",
    fontSize: "15px",
    color: "#4b5563"
  },
  browseText: {
    color: "#000",
    fontWeight: "600",
    textDecoration: "underline"
  },
  dropHint: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af"
  },
  fileCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    marginBottom: "25px",
    textAlign: "left"
  },
  fileInfo: {
    display: "flex",
    alignItems: "center",
    overflow: "hidden"
  },
  pdfIcon: {
    background: "#ef4444",
    color: "white",
    fontSize: "10px",
    fontWeight: "bold",
    padding: "6px 8px",
    borderRadius: "6px",
    marginRight: "12px"
  },
  fileDetails: {
    overflow: "hidden"
  },
  fileName: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px"
  },
  fileSize: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280"
  },
  previewBtn: {
    background: "transparent",
    border: "1px solid #d1d5db",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  uploadBtn: {
    width: "100%",
    padding: "14px",
    background: "#000",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  btnDisabled: {
    background: "#4b5563",
    cursor: "not-allowed"
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid #ffffff",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  successBox: {
    padding: "20px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    marginTop: "10px"
  },
  successIcon: {
    width: "30px",
    height: "30px",
    background: "#10b981",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 auto 10px auto"
  },
  successText: {
    margin: "0 0 15px 0",
    color: "#065f46",
    fontSize: "14px",
    fontWeight: "500"
  },
  continueBtn: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%"
  }
};
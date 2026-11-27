
import { useState } from "react";
import Modal from "./components/layout/common/Modal";
import Button from "./components/layout/common/Button";
import MainLayout from "./components/layout/MainLayout";
import Card from "./components/layout/common/Card";
import LoadingSpinner from "./components/layout/common/LoadingSpinner";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Upload selected file to the backend
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      setUploadMessage("");

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Upload failed!");
      }

      setUploadMessage("File uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);

      setUploadMessage(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout role="STUDENT" username="Mohamed">
      <div
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.55), rgba(37, 99, 235, 0.65)), url("https://www.magnific.com/free-photos-vectors/blue-color-background-css/7"), linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0ea5e9 100%)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "16px",
          padding: "36px 32px",
          marginBottom: "24px",
          color: "#ffffff",
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.2)",
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", color: "#ffffff" }}>
          Welcome, Mohamed
        </h1>
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          Welcome to your University Portal!
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <Card title="My Courses">
          <h2 style={{ color: "#2563eb" }}>4 Courses</h2>
          <p>You are currently enrolled in 4 courses.</p>
        </Card>

        <Card title="Assignments">
          <h2 style={{ color: "#f78c00" }}>3 Pending</h2>
          <p>You have 3 assignments to complete.</p>
        </Card>

        <Card title="Announcements">
          <h2 style={{ color: "#ff0000" }}>2 New</h2>
          <p>You have 2 new course announcements.</p>
        </Card>

        <LoadingSpinner message="Loading your courses..." />
      </div>

      <Button variant="primary" onClick={() => alert("Save clicked!")}>
        Save
      </Button>

      <Button variant="secondary" onClick={() => alert("Cancel clicked!")}>
        Cancel
      </Button>

      <Button variant="danger" onClick={() => alert("Delete clicked!")}>
        Delete
      </Button>

      <Button
        onClick={() => {
          setUploadMessage("");
          setIsModalOpen(true);
        }}
      >
        Open Modal
      </Button>

      <Modal
        title="Upload Material"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="upload-area">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "55px",
              color: "#2563eb",
              marginBottom: "12px",
            }}
          >
            upload_file
          </span>

          <p>Select a PDF or PowerPoint file to share with your students.</p>

          <label className="btn btn-secondary">
            Choose File
            <input
              type="file"
              accept=".pdf,.ppt,.pptx"
              style={{ display: "none" }}
              disabled={isUploading}
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] || null);
                setUploadMessage("");
              }}
            />
          </label>

          {selectedFile && (
            <div className="selected-file">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "28px",
                    color: selectedFile.name.endsWith(".pdf")
                      ? "#dc2626"
                      : "#ea580c",
                  }}
                >
                  {selectedFile.name.endsWith(".pdf")
                    ? "picture_as_pdf"
                    : "slideshow"}
                </span>

                {selectedFile.name}
              </span>

              <Button
                variant="danger"
                onClick={() => setSelectedFile(null)}
              >
                Remove
              </Button>
            </div>
          )}

          {uploadMessage && (
            <p
              style={{
                color: uploadMessage === "File uploaded successfully!"
                  ? "green"
                  : "red",
                marginTop: "12px",
              }}
            >
              {uploadMessage}
            </p>
          )}

          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </Modal>
    </MainLayout>
  );
}

export default App;

import { useEffect, useState } from "react";
import Card from "../layout/common/Card";

interface Material {
  id: number;
  title: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

interface MaterialListProps {
  courseId: number;
  refreshKey?: number;
}

function MaterialList({ courseId, refreshKey = 0 }: MaterialListProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/courses/${courseId}/materials`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setMaterials(data);
        }
      } catch (err) {
        console.error("Failed to load materials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [courseId, refreshKey]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/materials/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMaterials((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete material:", err);
    }
  };

  if (loading) return <p>Loading materials...</p>;

  if (materials.length === 0) {
    return (
      <Card title="Course Materials">
        <p>No materials uploaded yet for this course.</p>
      </Card>
    );
  }

  return (
    <Card title="Course Materials">
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {materials.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
            }}
          >
            <div>
              <strong>{item.title}</strong>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                {item.fileName} • {(item.fileSize / 1024).toFixed(1)} KB
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <a
                href={`http://localhost:3000/api/materials/${item.id}/download`}
                className="btn btn-primary"
                style={{ textDecoration: "none" }}
              >
                Download
              </a>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default MaterialList;
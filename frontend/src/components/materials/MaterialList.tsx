import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../layout/common/Card";
import type { CourseMaterial } from "../../types/material";
import {
  deleteMaterial,
  getCourseMaterials,
  getMaterialDownloadUrl,
} from "../../services/materialService";

interface MaterialListProps {
  courseId: number;
  refreshKey?: number;
  canManage?: boolean;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

function MaterialList({
  courseId,
  refreshKey = 0,
  canManage = false,
}: MaterialListProps) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourseMaterials(courseId);
        setMaterials(data);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load course materials."));
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [courseId, refreshKey]);

  const handleDownload = async (materialId: number) => {
    try {
      setError(null);
      const { downloadUrl } = await getMaterialDownloadUrl(materialId);
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to download material."));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteMaterial(id);
      setMaterials((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete material."));
    }
  };

  if (loading) return <p>Loading materials...</p>;

  if (error) {
    return (
      <Card title="Course Materials">
        <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>
      </Card>
    );
  }

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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleDownload(item.id)}
              >
                Download
              </button>
              {canManage && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default MaterialList;

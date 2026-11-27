import { useEffect, useState } from "react";
import Card from "../layout/common/Card";

interface Announcement {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  createdBy?: {
    fullName: string;
    role: string;
  };
}

interface AnnouncementFeedProps {
  courseId?: number;
  refreshKey?: number;
}

function AnnouncementFeed({ courseId, refreshKey = 0 }: AnnouncementFeedProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const url = courseId
          ? `http://localhost:3000/api/courses/${courseId}/announcements`
          : `http://localhost:3000/api/announcements/feed`;

        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.error("Failed to load announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [courseId, refreshKey]);

  if (loading) return <p>Loading announcements...</p>;

  if (announcements.length === 0) {
    return (
      <Card title="Announcements">
        <p>No announcements yet.</p>
      </Card>
    );
  }

  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("quiz") || lower.includes("exam")) return "quiz";
    if (lower.includes("important") || lower.includes("urgent"))
      return "priority_high";
    return "campaign";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {announcements.map((item) => (
        <Card key={item.id} title={item.title}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span
              className="material-symbols-outlined"
              style={{
                color:
                  getIcon(item.title) === "priority_high"
                    ? "#dc2626"
                    : "#2563eb",
                fontSize: "24px",
              }}
            >
              {getIcon(item.title)}
            </span>
            <div>
              <p style={{ margin: "0 0 10px 0", lineHeight: 1.6 }}>
                {item.content}
              </p>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Posted by{" "}
                <strong>{item.createdBy?.fullName || "Instructor"}</strong> •{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default AnnouncementFeed;

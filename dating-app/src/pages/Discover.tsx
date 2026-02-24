import { useState, useEffect } from "react";
import { storage } from "../storage";
import type { Profile } from "../storage";
import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Discover = ({
  currentUserId,
  onAction,
}: {
  currentUserId: string;
  onAction: () => void;
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState<{
    isMatch: boolean;
    matchId: string | null;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const allProfiles = await storage.getProfiles();
      const likes = await storage.getLikes();
      const likesAndSkips = likes
        .filter((l) => l.fromUserId === currentUserId)
        .map((l) => l.toUserId);
      const available = allProfiles.filter(
        (p) => p.id !== currentUserId && !likesAndSkips.includes(p.id),
      );
      setProfiles(available);
      setCurrentIndex(0);
    };
    load();
  }, [currentUserId, showMatch]);

  const handleAction = async (profileId: string, isLike: boolean) => {
    if (isLike) {
      const matched = await storage.addLike(currentUserId, profileId);
      if (matched) {
        // Find match id
        const matches = await storage.getMatches();
        const m = matches.find(
          (ms: any) =>
            (ms.user1Id === currentUserId && ms.user2Id === profileId) ||
            (ms.user1Id === profileId && ms.user2Id === currentUserId),
        );
        setShowMatch({ isMatch: true, matchId: m?.id || null });
        onAction(); // Update root state
        return;
      } else {
        onAction();
      }
    } else {
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const currentProfile = profiles[currentIndex];

  if (showMatch) {
    return (
      <div className="match-screen">
        <h1 className="match-title">It's a Match!</h1>
        <p
          style={{ fontSize: 18, marginBottom: 40, color: "var(--text-muted)" }}
        >
          You and this person have liked each other.
        </p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate(`/date/${showMatch.matchId}`)}
          style={{ width: "80%", maxWidth: 300, fontSize: 18, padding: 16 }}
        >
          Propose Date Timing
        </button>
        <button
          className="btn btn-secondary mt-4"
          onClick={() => setShowMatch(null)}
          style={{ width: "80%", maxWidth: 300 }}
        >
          Keep Browsing
        </button>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div
        className="p-4"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="glass-panel text-center w-100">
          <Heart
            size={48}
            color="var(--surface-border)"
            style={{ margin: "0 auto 16px" }}
          />
          <h3>No more profiles</h3>
          <p style={{ color: "var(--text-muted)" }}>
            Check back later for new people!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 page-enter page-enter-active"
      style={{
        height: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="profile-card flex-1">
        <div className="profile-img-placeholder">
          <span style={{ fontSize: 64, opacity: 0.1, fontWeight: 700 }}>
            {currentProfile.name.charAt(0)}
          </span>
        </div>

        <div className="profile-info">
          <div className="profile-name">
            {currentProfile.name},{" "}
            <span className="profile-age">{currentProfile.age}</span>
          </div>
          <div style={{ fontSize: 14, color: "#ffb74d", marginBottom: 8 }}>
            {currentProfile.gender}
          </div>
          <div className="profile-bio">{currentProfile.bio}</div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-icon btn-skip"
          onClick={() => handleAction(currentProfile.id, false)}
          aria-label="Skip"
        >
          <X size={32} />
        </button>
        <button
          className="btn btn-icon btn-like"
          onClick={() => handleAction(currentProfile.id, true)}
          aria-label="Like"
        >
          <Heart size={30} fill="#ff4b4b" />
        </button>
      </div>
    </div>
  );
};

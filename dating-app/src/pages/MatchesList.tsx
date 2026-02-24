import { useState, useEffect } from "react";
import { storage } from "../storage";
import type { Match, Profile } from "../storage";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

export const MatchesList = ({ currentUserId }: { currentUserId: string }) => {
  const [matches, setMatches] = useState<{ match: Match; profile: Profile }[]>(
    [],
  );

  useEffect(() => {
    const load = async () => {
      const list = await storage.getMatchesForUser(currentUserId);
      const hydrated = [];
      for (const m of list) {
        const otherId = m.user1Id === currentUserId ? m.user2Id : m.user1Id;
        const profile = await storage.getProfile(otherId);
        if (profile) hydrated.push({ match: m, profile });
      }
      setMatches(hydrated);
    };
    load();
  }, [currentUserId]);

  return (
    <div className="p-4 page-enter page-enter-active">
      <h2 style={{ marginBottom: 24, fontSize: 24 }}>Your Matches</h2>

      {matches.length === 0 ? (
        <div className="glass-panel text-center">
          <p style={{ color: "var(--text-muted)" }}>
            You haven't matched with anyone yet.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Keep swiping to find your pair!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {matches.map(({ match, profile }) => (
            <Link
              key={match.id}
              to={`/date/${match.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="glass-panel"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--primary), var(--secondary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  {profile.name.charAt(0)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: "bold" }}>
                    {profile.name}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    {profile.age} • {profile.gender}
                  </div>
                </div>

                <div>
                  <Clock size={24} color="var(--primary)" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

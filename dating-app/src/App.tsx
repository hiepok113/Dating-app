import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { storage } from "./storage";
import type { Profile } from "./storage";
import { User, Heart, MessageCircle, LogOut } from "lucide-react";
import { CreateProfile } from "./pages/CreateProfile";
import { Discover } from "./pages/Discover";
import { MatchesList } from "./pages/MatchesList";
import { ProposeDate } from "./pages/ProposeDate";
import { Auth } from "./pages/Auth";

export const App = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    storage.getCurrentUserId(),
  );
  const [hasProfile, setHasProfile] = useState<boolean>(true);

  // Function to refresh profiles state
  const refreshStorage = async () => {
    const p = await storage.getProfiles();
    setProfiles(p);
    const uid = storage.getCurrentUserId();
    setCurrentUserId(uid);

    if (uid) {
      const myProfile = await storage.getProfile(uid);
      setHasProfile(!!myProfile);
    }
  };

  useEffect(() => {
    refreshStorage();
  }, []);

  const handleLogin = (id: string) => {
    storage.setCurrentUserId(id);
    refreshStorage();
  };

  const handleLogout = () => {
    storage.setCurrentUserId(null);
    setCurrentUserId(null);
    setHasProfile(false);
  };

  // If not logged in, just show Auth screen
  if (!currentUserId) {
    return (
      <div className="app-container">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <Heart size={24} color="#FF4B4B" fill="#FF4B4B" />
            Clique
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 13, color: "#aaaaaa" }}>
              Welcome,{" "}
              <span style={{ color: "white", fontWeight: 600 }}>
                {hasProfile
                  ? profiles.find((p) => p.id === currentUserId)?.name || "User"
                  : "User"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#ffb74d",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          className="flex-1"
          style={{ position: "relative", overflowX: "hidden" }}
        >
          {!hasProfile ? (
            <Routes>
              <Route
                path="*"
                element={
                  <CreateProfile
                    currentUserId={currentUserId}
                    onSave={refreshStorage}
                  />
                }
              />
            </Routes>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <Discover
                    currentUserId={currentUserId}
                    onAction={refreshStorage}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <CreateProfile
                    currentUserId={currentUserId}
                    onSave={refreshStorage}
                  />
                }
              />
              <Route
                path="/matches"
                element={<MatchesList currentUserId={currentUserId} />}
              />
              <Route
                path="/date/:matchId"
                element={<ProposeDate currentUserId={currentUserId} />}
              />
            </Routes>
          )}
        </main>

        {/* Bottom Navigation */}
        {hasProfile && (
          <nav className="nav-bar">
            <NavButton to="/" icon={<Heart size={24} />} label="Discover" />
            <NavButton
              to="/matches"
              icon={<MessageCircle size={24} />}
              label="Matches"
            />
            <NavButton
              to="/profile"
              icon={<User size={24} />}
              label="Profile"
            />
          </nav>
        )}
      </div>
    </BrowserRouter>
  );
};

// Navigation item helper that sets active class
const NavButton = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`nav-item ${isActive ? "active" : ""}`}>
      {React.cloneElement(icon as React.ReactElement<any>, {
        color: isActive ? "var(--primary)" : "var(--text-muted)",
      })}
      <span>{label}</span>
    </Link>
  );
};

export default App;

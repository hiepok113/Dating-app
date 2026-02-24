import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storage } from "../storage";
import type { Availability, Profile } from "../storage";
import { findCommonSlot, formatSlotTime } from "../utils/scheduler";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export const ProposeDate = ({ currentUserId }: { currentUserId: string }) => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  const [partner, setPartner] = useState<Profile | null>(null);
  const [mySlots, setMySlots] = useState<Availability[]>([
    { date: "", startHour: 18, endHour: 20 },
  ]);
  const [partnerSlots, setPartnerSlots] = useState<Availability[]>([]);
  const [mySubmitted, setMySubmitted] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);
  const [commonSlot, setCommonSlot] = useState<{
    date: string;
    hour: number;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!matchId) return;

      const matches = await storage.getMatches();
      const match = matches.find((m) => m.id === matchId);
      if (!match) return;

      const partnerId =
        match.user1Id === currentUserId ? match.user2Id : match.user1Id;
      const pInfo = await storage.getProfile(partnerId);
      if (pInfo) setPartner(pInfo);

      const allAvails = await storage.getAvailabilitiesForMatch(matchId);

      const myA = allAvails.find((a) => a.userId === currentUserId);
      if (myA) {
        setMySlots(myA.availabilities);
        setMySubmitted(true);
      }

      const partnerA = allAvails.find((a) => a.userId === partnerId);
      if (partnerA) {
        setPartnerSlots(partnerA.availabilities);
        setPartnerSubmitted(true);
      }

      if (myA && partnerA) {
        const slot = findCommonSlot(
          myA.availabilities,
          partnerA.availabilities,
        );
        setCommonSlot(slot);
      }
    };
    load();
  }, [matchId, currentUserId]);

  const addSlot = () =>
    setMySlots([...mySlots, { date: "", startHour: 18, endHour: 20 }]);
  const removeSlot = (index: number) => {
    if (mySlots.length > 1) {
      setMySlots(mySlots.filter((_, i) => i !== index));
    }
  };

  const updateSlot = (index: number, field: keyof Availability, value: any) => {
    const updated = [...mySlots];
    updated[index] = { ...updated[index], [field]: value };
    setMySlots(updated);
  };

  const handleSubmit = async () => {
    const invalid = mySlots.some(
      (s) =>
        !s.date ||
        s.startHour === undefined ||
        s.endHour === undefined ||
        s.startHour >= s.endHour,
    );
    if (invalid) {
      alert(
        "Vui lòng nhập ngày và giờ hợp lệ (Giờ bắt đầu phải nhỏ hơn giờ kết thúc).",
      );
      return;
    }

    await storage.saveAvailability(matchId!, currentUserId, mySlots);
    setMySubmitted(true);

    if (partnerSubmitted) {
      const slot = findCommonSlot(mySlots, partnerSlots);
      setCommonSlot(slot);
    }
  };

  const handleReset = async () => {
    await storage.saveAvailability(matchId!, currentUserId, []);
    setMySubmitted(false);
    setCommonSlot(null);
  };

  const renderBothSubmitted = () => {
    if (commonSlot) {
      return (
        <div className="glass-panel text-center page-enter page-enter-active">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: "var(--primary)", marginBottom: 16 }}>
            It's a Date!
          </h2>
          <p style={{ fontSize: 18 }}>
            Hai bạn có date hẹn vào:
            <br />
            <strong
              style={{
                color: "white",
                display: "block",
                marginTop: 8,
                fontSize: 20,
              }}
            >
              {formatSlotTime(commonSlot.date, commonSlot.hour)}
            </strong>
          </p>
        </div>
      );
    } else {
      return (
        <div className="glass-panel text-center page-enter page-enter-active">
          <div style={{ fontSize: 64, marginBottom: 16 }}>💔</div>
          <h2 style={{ color: "var(--text-main)", marginBottom: 16 }}>
            No Time Overlay
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)" }}>
            Chưa tìm được thời gian trùng. Vui lòng chọn lại.
          </p>
          <button
            className="btn btn-secondary w-100 mt-4"
            onClick={handleReset}
          >
            Re-enter Availabilities
          </button>
        </div>
      );
    }
  };

  if (!partner) return <div>Loading...</div>;

  return (
    <div
      className="p-4 page-enter page-enter-active"
      style={{ paddingBottom: 100 }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/matches")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          marginBottom: 20,
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={16} /> Back to matches
      </button>

      <h2 style={{ marginBottom: 24 }}>Plan Date with {partner.name}</h2>

      {mySubmitted && partnerSubmitted ? (
        renderBothSubmitted()
      ) : (
        <>
          <div className="glass-panel mb-4">
            <h3 style={{ marginBottom: 16 }}>Your Free Time (Next 3 Weeks)</h3>

            {mySubmitted ? (
              <div
                style={{
                  color: "#4caf50",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(76, 175, 80, 0.1)",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                ✅ You have submitted your availability.
              </div>
            ) : (
              <div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    marginBottom: 16,
                  }}
                >
                  Choose the dates and hours you are free. We will calculate the
                  first overlapping hour with {partner.name}.
                </p>
                {mySlots.map((slot, idx) => (
                  <div key={idx} className="slot-row">
                    <input
                      type="date"
                      className="slot-input"
                      value={slot.date}
                      onChange={(e) => updateSlot(idx, "date", e.target.value)}
                      // Min = today, Max = +3 weeks
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <select
                      className="slot-input"
                      value={slot.startHour}
                      onChange={(e) =>
                        updateSlot(idx, "startHour", parseInt(e.target.value))
                      }
                    >
                      {[...Array(24)].map((_, h) => (
                        <option key={h} value={h}>
                          {h}h
                        </option>
                      ))}
                    </select>
                    <select
                      className="slot-input"
                      value={slot.endHour}
                      onChange={(e) =>
                        updateSlot(idx, "endHour", parseInt(e.target.value))
                      }
                    >
                      {[...Array(24)].map((_, h) => (
                        <option key={h} value={h}>
                          {h}h
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeSlot(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                      disabled={mySlots.length === 1}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={addSlot}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    cursor: "pointer",
                    marginTop: 12,
                    fontWeight: 600,
                  }}
                >
                  <Plus size={16} /> Add another slot
                </button>

                <button
                  className="btn btn-primary w-100 mt-4"
                  onClick={handleSubmit}
                >
                  Submit Availability
                </button>
              </div>
            )}
          </div>

          <div className="glass-panel text-center">
            {partnerSubmitted ? (
              <div style={{ color: "#ffb74d" }}>
                🎉 {partner.name} has submitted their availability!
              </div>
            ) : (
              <div style={{ color: "var(--text-muted)" }}>
                ⏳ Waiting for {partner.name} to submit their availability...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

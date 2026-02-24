import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../storage";
import { useNavigate } from "react-router-dom";

export const CreateProfile = ({
  currentUserId,
  onSave,
}: {
  currentUserId: string | null;
  onSave: () => void;
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("Male");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      storage.getProfile(currentUserId).then((p) => {
        if (p) {
          setName(p.name);
          setAge(p.age);
          setGender(p.gender);
          setBio(p.bio);
          setEmail(p.email);
        }
      });
    } else {
      setName("");
      setAge("");
      setGender("Male");
      setBio("");
      setEmail("");
    }
  }, [currentUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !age || !bio || !email) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const id = currentUserId || uuidv4();
    const profile = {
      id,
      name,
      age: Number(age),
      gender,
      bio,
      email,
    };

    await storage.saveProfile(profile);
    storage.setCurrentUserId(id);
    onSave();
    navigate("/");
  };

  return (
    <div className="p-4 page-enter page-enter-active">
      <div className="glass-panel">
        <h2 style={{ marginBottom: 24 }}>
          {currentUserId ? "Update Profile" : "Create Profile"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="form-group" style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Tuổi</label>
              <input
                type="number"
                className="form-control"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="22"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Giới tính</label>
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              style={{ resize: "none" }}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-4">
            {currentUserId ? "Save Profile" : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

import { useState } from "react";

export default function ProfileSelect({ user, onSelectProfile, onLogout }) {
  const storageKey = `profiles_${user}`;

  const savedProfiles =
    JSON.parse(localStorage.getItem(storageKey)) || [];

  const [profiles, setProfiles] = useState(savedProfiles);
  const [newName, setNewName] = useState("");
  const [manageMode, setManageMode] = useState(false);

  const saveProfiles = (updatedProfiles) => {
    setProfiles(updatedProfiles);
    localStorage.setItem(storageKey, JSON.stringify(updatedProfiles));
  };

  const addProfile = () => {
    if (!newName.trim()) {
      alert("Enter profile name");
      return;
    }

    if (profiles.length >= 5) {
      alert("Only 5 profiles allowed");
      return;
    }

    const newProfile = {
      id: Date.now(),
      name: newName.trim(),
      avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${newName}`
    };

    saveProfiles([...profiles, newProfile]);
    setNewName("");
  };

  const deleteProfile = (id) => {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
    saveProfiles(updatedProfiles);
  };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Who's watching?</h1>

      <div style={profilesWrapperStyle}>
        {profiles.map((profile) => (
          <div key={profile.id} style={profileCardStyle}>
            <img
              src={profile.avatar}
              alt={profile.name}
              style={avatarStyle}
              onClick={() => {
                if (!manageMode) {
                  onSelectProfile(profile);
                }
              }}
            />

            <p style={profileNameStyle}>{profile.name}</p>

            {manageMode && (
              <button
                onClick={() => deleteProfile(profile.id)}
                style={deleteButtonStyle}
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {profiles.length < 5 && (
          <div style={profileCardStyle}>
            <div style={addIconStyle}>+</div>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Profile name"
              style={inputStyle}
            />

            <button onClick={addProfile} style={addButtonStyle}>
              Add Profile
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => setManageMode(!manageMode)}
        style={manageButtonStyle}
      >
        {manageMode ? "Done" : "Manage Profiles"}
      </button>

      <button onClick={onLogout} style={logoutButtonStyle}>
        Logout
      </button>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#141414",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial, sans-serif"
};

const headingStyle = {
  fontSize: "42px",
  fontWeight: "400",
  marginBottom: "35px"
};

const profilesWrapperStyle = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "35px"
};

const profileCardStyle = {
  width: "150px",
  textAlign: "center"
};

const avatarStyle = {
  width: "130px",
  height: "130px",
  borderRadius: "8px",
  background: "#333",
  cursor: "pointer",
  objectFit: "cover"
};

const profileNameStyle = {
  color: "#aaa",
  fontSize: "18px",
  marginTop: "10px"
};

const addIconStyle = {
  width: "130px",
  height: "130px",
  borderRadius: "8px",
  background: "#333",
  color: "#aaa",
  fontSize: "70px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 10px"
};

const inputStyle = {
  width: "130px",
  padding: "8px",
  background: "#333",
  color: "white",
  border: "1px solid #555",
  borderRadius: "4px",
  marginBottom: "8px"
};

const addButtonStyle = {
  padding: "8px 12px",
  background: "white",
  color: "black",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold"
};

const manageButtonStyle = {
  padding: "10px 25px",
  background: "transparent",
  color: "#aaa",
  border: "1px solid #aaa",
  cursor: "pointer",
  fontSize: "16px",
  marginBottom: "15px"
};

const deleteButtonStyle = {
  padding: "6px 12px",
  background: "#e50914",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const logoutButtonStyle = {
  padding: "8px 18px",
  background: "transparent",
  color: "#777",
  border: "1px solid #555",
  cursor: "pointer"
};
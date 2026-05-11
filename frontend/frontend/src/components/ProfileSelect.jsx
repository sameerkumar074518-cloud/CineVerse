import { useState } from "react";

export default function ProfileSelect({ user, onSelectProfile, onLogout }) {
  const storageKey = `profiles_${user}`;

  const savedProfiles =
    JSON.parse(localStorage.getItem(storageKey)) || [];

  const [profiles, setProfiles] = useState(savedProfiles);
  const [newName, setNewName] = useState("");
  const [manageMode, setManageMode] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const saveProfiles = (updatedProfiles) => {
    setProfiles(updatedProfiles);
    localStorage.setItem(storageKey, JSON.stringify(updatedProfiles));
  };
  const addProfile = () => {
    if (!newName.trim()) {
      alert("Enter profile name");
      return;
    }
    const alreadyExists = profiles.some(
  (profile) =>
    profile.name.toLowerCase().trim() ===
    newName.toLowerCase().trim()
);

if (alreadyExists) {
  alert("This profile name already exists. Enter another profile name.");
  return;
}
    if (profiles.length >= 5) {
      alert("Only 5 profiles allowed");
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      name: newName.trim(),
      avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${newName}-${Date.now()}`
    };

    saveProfiles([...profiles, newProfile]);
setNewName("");
setShowAddPopup(false);
  };

  const deleteProfile = (id) => {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
    saveProfiles(updatedProfiles);
  };

  return (
    <div style={pageStyle}>
        <style>{`
  img:hover {
    border: 4px solid white !important;
    transform: scale(1.05);
  }

  button:hover {
    color: white !important;
    border-color: white !important;
  }
`}</style>
      <h1 style={headingStyle}>Who's watching?</h1>

      <div style={profilesWrapperStyle}>
        {profiles.map((profile) => (
          <div key={profile.id} style={profileCardStyle}>
            <img
              src={profile.avatar}
              alt={profile.name}
              style={{
  ...avatarStyle,
  border:
    manageMode
      ? "4px solid #e50914"
      : "4px solid transparent"
}}
              onClick={() => {
                if (!manageMode) {
                  localStorage.removeItem("myList");
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
    <div
      style={addIconStyle}
      onClick={() => setShowAddPopup(true)}
    >
      ＋
    </div>
  </div>
)}
      </div>

      <button
        onClick={() => setManageMode(!manageMode)}
        style={manageButtonStyle}
      >
        {manageMode ? "Done" : "Manage Profiles"}
      </button>
      {showAddPopup && (
  <div style={popupOverlayStyle}>
    <div style={popupBoxStyle}>
      <h2 style={{ marginTop: 0 }}>Add Profile</h2>

      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Enter profile name"
        style={popupInputStyle}
      />

      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button onClick={addProfile} style={addButtonStyle}>
          Done
        </button>

        <button
          onClick={() => {
            setNewName("");
            setShowAddPopup(false);
          }}
          style={cancelButtonStyle}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
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
  fontFamily: "Helvetica, Arial, sans-serif",
  padding: "20px"
};

const headingStyle = {
  fontSize: "clamp(38px, 5vw, 62px)",
  fontWeight: "400",
  marginBottom: "55px",
  letterSpacing: "1px"
};

const profilesWrapperStyle = {
  display: "flex",
  gap: "35px",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "flex-start",
  marginBottom: "55px",
  maxWidth: "1200px"
};

const profileCardStyle = {
  width: "180px",
  textAlign: "center",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const avatarStyle = {
  width: "170px",
  height: "170px",
  borderRadius: "4px",
  background: "#333",
  cursor: "pointer",
  objectFit: "cover",
  border: "4px solid transparent",
  transition: "0.2s"
};

const profileNameStyle = {
  color: "#808080",
  fontSize: "22px",
  marginTop: "15px",
  fontWeight: "400",
  textAlign: "center"
};

const addIconStyle = {
  width: "170px",
  height: "170px",
  borderRadius: "4px",
  background: "#2b2b2b",
  color: "#777",
  fontSize: "95px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  transition: "0.2s"
};

const inputStyle = {
  width: "155px",
  padding: "10px",
  background: "#2b2b2b",
  color: "white",
  border: "1px solid #555",
  borderRadius: "3px",
  marginBottom: "10px",
  textAlign: "center",
  outline: "none",
  fontSize: "15px"
};

const addButtonStyle = {
  padding: "10px 18px",
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px"
};

const manageButtonStyle = {
  padding: "14px 38px",
  background: "transparent",
  color: "#808080",
  border: "1px solid #808080",
  cursor: "pointer",
  fontSize: "20px",
  letterSpacing: "2px",
  marginBottom: "20px",
  transition: "0.2s"
};

const deleteButtonStyle = {
  padding: "7px 14px",
  background: "#e50914",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "10px",
  fontWeight: "bold"
};
const popupOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99999
};

const popupBoxStyle = {
  background: "#181818",
  color: "white",
  width: "360px",
  padding: "30px",
  borderRadius: "6px",
  textAlign: "center",
  boxShadow: "0 10px 35px rgba(0,0,0,0.8)"
};

const popupInputStyle = {
  width: "100%",
  padding: "12px",
  background: "#333",
  color: "white",
  border: "1px solid #666",
  borderRadius: "4px",
  marginBottom: "20px",
  outline: "none",
  boxSizing: "border-box",
  fontSize: "16px"
};

const cancelButtonStyle = {
  padding: "10px 18px",
  background: "transparent",
  color: "#aaa",
  border: "1px solid #666",
  borderRadius: "3px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px"
};
export default function Footer() {
  return (
    <div id="about-section" style={{   // ✅ ONLY CHANGE ADDED HERE
      background: "#0b0b0b",
      color: "#aaa",
      padding: "20px 20px 10px",
      marginTop: "50px",
      borderTop: "1px solid #222",
      textAlign: "center"
    }}>

      {/* 🌟 WEBSITE NAME WITH GLOW */}
      <h1 style={{
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "10px",
        background: "linear-gradient(90deg, #0f79af, #00d4ff, #0f79af)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "glow 2s ease-in-out infinite alternate"
      }}>
        CineVerse 🎬
      </h1>

      {/* 🎬 DESCRIPTION (NO ANIMATION) */}
      <p style={{
        fontSize: "16px",
        maxWidth: "600px",
        margin: "0 auto",
        lineHeight: "1.6",
        color: "#cc3193"
      }}>
       Experience cinema the way it was meant to be.
      </p>

      {/* 🚀 COMING SOON */}
      <p style={{
        marginTop: "12px",
        fontSize: "16px",
        fontWeight: "bold",
        background: "linear-gradient(90deg, #ff4d4d, #ffa500, #00ffcc)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "pulse 1.5s infinite"
      }}>
        🚀 More Movies Coming Soon...
      </p>

      {/* ❤️ CREDIT */}
      <h3 style={{
        color: "white",
        marginTop: "15px"
      }}>
        Made with ❤️ by Sameer
      </h3>

      {/* 🔗 LINKS WITH REAL ICONS */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "25px",
        flexWrap: "wrap",
        marginTop: "15px"
      }}>

        {/* EMAIL */}
        <a href="https://share.google/UOZEkQSdk9VCVrLoh" style={linkStyle}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="email"
            style={iconStyle}
          />
          Email
        </a>

        {/* GITHUB */}
        <a href="https://github.com/sameerkumar074518-cloud" target="_blank" style={linkStyle}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="github"
            style={iconStyle}
          />
          GitHub
        </a>

        {/* INSTAGRAM */}
        <a href="https://www.instagram.com/sameerxcuts" target="_blank" style={linkStyle}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="instagram"
            style={iconStyle}
          />
          Instagram
        </a>

      </div>

      {/* 🧾 COPYRIGHT */}
      <p style={{
        textAlign: "center",
        marginTop: "25px",
        fontSize: "13px",
        color: "#666"
      }}>
        © {new Date().getFullYear()} CineVerse. All rights reserved.
      </p>

      {/* ✨ ANIMATIONS */}
      <style>
        {`
          @keyframes glow {
            from {
              text-shadow: 0 0 10px #0f79af, 0 0 20px #0f79af;
            }
            to {
              text-shadow: 0 0 20px #00d4ff, 0 0 30px #00d4ff;
            }
          }

          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>

    </div>
  );
}

/* 🔗 LINK STYLE */
const linkStyle = {
  color: "#0f79af",
  textDecoration: "none",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "6px"
};

/* 🎯 ICON STYLE */
const iconStyle = {
  width: "18px",
  height: "18px"
};
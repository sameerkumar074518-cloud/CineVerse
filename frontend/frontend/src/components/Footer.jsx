import { useState, useEffect } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPos = window.innerHeight + window.scrollY;
      
      // Increased threshold to 150px for a smoother, lag-free reveal
      if (scrollHeight - scrollPos <= 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const openHelp = () => setModalContent({
    title: "CineVerse Help Centre",
    body: (
      <div style={{ lineHeight: '1.8' }}>
        <p><b>Search Bar:</b> Use the icon in the Navbar to find movies by title or genre instantly.</p>
        <p><b>Information:</b> Click any movie card to view a detailed synopsis and cast info.</p>
        <p><b>Downloads:</b> Use the download icon on the player to save movies for offline viewing.</p>
        <p><b>My List:</b> Click the '+' icon to save titles to your personalized collection.</p>
        <hr style={{ border: '0.5px solid #333', margin: '15px 0' }} />
        <p style={{ color: '#fff' }}><b>Need Technical Support?</b></p>
        <p>If you encounter any errors, bugs, or playback issues, please contact the developer directly. You can message me on <b>Instagram (@sameerxcuts) or mail me</b> for a quick resolution.</p>
      </div>
    )
  });

  const openPrivacy = () => setModalContent({
    title: "Privacy Policy",
    body: "CineVerse respects your privacy. We encrypt your credentials and do not share your viewing history with third parties. Your data is used solely to provide a personalized streaming experience."
  });

  return (
    <footer id="about-section" style={{
      ...footerContainerStyle,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(30px)", // Reduced travel distance for smoothness
      pointerEvents: isVisible ? "auto" : "none"
    }}>
      
      {modalContent && (
        <div style={modalOverlay} onClick={() => setModalContent(null)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#E50914', marginBottom: '15px' }}>{modalContent.title}</h3>
            <div style={{ color: '#ccc', fontSize: '13px' }}>{modalContent.body}</div>
            <button style={modalCloseBtn} onClick={() => setModalContent(null)}>Close</button>
          </div>
        </div>
      )}

      <div style={contentWrapperStyle}>
        <div style={logoSectionStyle}>
          <h2 style={logoTextStyle}>CINEVERSE</h2>
          <p style={taglineStyle}>Experience cinema the way it was meant to be.</p>
        </div>

        <div style={gridStyle}>
          <div style={columnStyle}>
            <p style={columnTitleStyle}>Navigation</p>
            <a href="#" onClick={scrollToTop} className="f-link" style={footerLinkStyle}>Browse Home</a>
            <a href="#movies-section" className="f-link" style={footerLinkStyle}>All Movies</a>
          </div>

          <div style={columnStyle}>
            <p style={columnTitleStyle}>Connect</p>
            <a href="mailto:your-email@gmail.com" className="f-link" style={footerLinkStyle}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" style={miniIcon} alt="" /> Email
            </a>
            <a href="https://github.com/sameerkumar074518-cloud" target="_blank" rel="noreferrer" className="f-link" style={footerLinkStyle}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" style={miniIcon} alt="" /> GitHub
            </a>
            <a href="https://www.instagram.com/sameerxcuts" target="_blank" rel="noreferrer" className="f-link" style={footerLinkStyle}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" style={miniIcon} alt="" /> Instagram
            </a>
          </div>

          <div style={columnStyle}>
            <p style={columnTitleStyle}>Legal</p>
            <span onClick={openHelp} className="f-link" style={footerLinkStyle}>Help Centre</span>
            <span onClick={openPrivacy} className="f-link" style={footerLinkStyle}>Privacy Policy</span>
          </div>
        </div>

        <div style={bottomSectionStyle}>
          <p style={madeByStyle}>Executive Producer: <span style={{color: '#fff', fontWeight: 'bold'}}>Sameer</span></p>
          <p style={copyrightStyle}>© {new Date().getFullYear()} CineVerse Global, Inc. All rights reserved.</p>
          <div style={serviceCodeStyle}>Service Code: 887-211</div>
        </div>
      </div>

      <style>{`
        .f-link:hover { color: #ffffff !important; text-decoration: underline !important; }
      `}</style>
    </footer>
  );
}

/* --- REFINED STYLES FOR ZERO-LAG --- */

const footerContainerStyle = {
  background: "#000", 
  color: "#808080", 
  padding: "80px 4% 60px", 
  marginTop: "60px",
  borderTop: "1px solid #1a1a1a", 
  fontFamily: "'Inter', sans-serif",
  // Improved transition for smooth reveal
  transition: "opacity 0.6s ease-out, transform 0.6s ease-out", 
  position: 'relative'
};

const logoSectionStyle = { textAlign: "center", marginBottom: "60px" };

const logoTextStyle = { 
  color: "#E50914", fontSize: "48px", fontWeight: "950", 
  letterSpacing: "10px", margin: "0 0 10px 0", textTransform: "uppercase" 
};

const taglineStyle = { 
  fontSize: "20px", color: "#eee", fontWeight: "600", letterSpacing: "3px",
  marginTop: "10px"
};

const contentWrapperStyle = { maxWidth: "1000px", margin: "0 auto" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "60px" };
const columnStyle = { display: "flex", flexDirection: "column", gap: "14px" };
const columnTitleStyle = { color: "#fff", fontSize: "16px", fontWeight: "700", marginBottom: "10px" };
const footerLinkStyle = { color: "#808080", textDecoration: "none", fontSize: "14px", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '8px' };
const miniIcon = { width: '18px', height: '18px' };

const bottomSectionStyle = { 
  borderTop: "2px solid #222", 
  paddingTop: "40px", 
  display: "flex", 
  flexDirection: "column", 
  alignItems: "center", 
  gap: "15px" 
};

const madeByStyle = { fontSize: "20px", color: "#bbb", margin: 0, letterSpacing: "1px" }; 
const copyrightStyle = { fontSize: "16px", color: "#777", margin: 0, fontWeight: "500" };
const serviceCodeStyle = { border: "1px solid #444", padding: "6px 16px", fontSize: "13px", color: "#555", marginTop: "10px" };

const modalOverlay = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center',
  alignItems: 'center', zIndex: 10000, pointerEvents: 'auto'
};

const modalBox = {
  background: '#111', padding: '40px', borderRadius: '4px',
  maxWidth: '500px', width: '90%', textAlign: 'left', border: '1px solid #222',
  maxHeight: '80vh', overflowY: 'auto'
};

const modalCloseBtn = {
  marginTop: '25px', background: '#E50914', color: '#fff', border: 'none',
  padding: '12px 25px', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold', width: '100%'
};
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const sendBrevoEmail = async ({ to, subject, htmlContent, senderName }) => {
  const response = await fetch(BREVO_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: process.env.EMAIL_FROM
      },
      to: [{ email: to }],
      subject,
      htmlContent
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("❌ Brevo API Error:", data);
    throw new Error(data.message || "Brevo email failed");
  }

  return data;
};

const sendWelcomeEmail = async (email) => {
  await sendBrevoEmail({
    to: email,
    senderName: "CineVerse",
    subject: "Welcome to CineVerse 🎬",
    htmlContent: `
<div style="
  background:#0b0b0b;
  padding:50px;
  font-family:Arial,sans-serif;
  color:white;
  border-radius:16px;
">

  <div style="text-align:center;">
    <h1 style="
      color:#e50914;
      font-size:43px;
      margin-bottom:5px;
      letter-spacing:4px;
    ">
      CINEVERSE
    </h1>

    <p style="
      color:#999;
      font-size:15px;
      letter-spacing:3px;
      margin-top:0;
    ">
      PREMIUM STREAMING EXPERIENCE
    </p>
  </div>

  <h2 style="
    font-size:32px;
    margin-bottom:15px;
    color:white;
  ">
    Welcome to CineVerse 🎬
  </h2>

  <p style="
    color:#cfcfcf;
    line-height:1.8;
    font-size:16px;
  ">
    Your CineVerse account has been successfully created.
    Get ready to explore blockbuster movies, trending series and premium entertainment.
  </p>

  <div style="
    background:#161616;
    padding:25px;
    border-radius:12px;
    margin-top:30px;
    border:1px solid #222;
  ">

    <h3 style="
      margin-top:0;
      color:#e50914;
    ">
      Your Premium Features
    </h3>

    <p>✅ Unlimited Movies & Series</p>
    <p>✅ Continue Watching</p>
    <p>✅ Multiple Profiles</p>
    <p>✅ My List & Favorites</p>
    <p>✅ Netflix-style Experience</p>

  </div>

  <div style="text-align:center;">
    <a
      href="https://cineverse-global.vercel.app/"
      style="
        display:inline-block;
        margin-top:35px;
        background:#e50914;
        color:white;
        padding:16px 34px;
        text-decoration:none;
        border-radius:8px;
        font-size:16px;
        font-weight:bold;
      "
    >
      START WATCHING
    </a>
  </div>

  <p style="
    margin-top:45px;
    color:#666;
    text-align:center;
    font-size:13px;
  ">
    © CineVerse Global Entertainment
  </p>

</div>
`
  });

  console.log("✅ Welcome email sent to:", email);
};

const sendResetEmail = async (email, code) => {
  await sendBrevoEmail({
    to: email,
    senderName: "CineVerse Security",
    subject: "Reset Your CineVerse Password 🔒",
    htmlContent: `
      <h1 style="color:#e50914;">CINEVERSE</h1>
      <h2>Password Reset Request</h2>
      <p>Your reset code is:</p>
      <h1 style="letter-spacing:8px;color:#e50914;">${code}</h1>
      <p>This code will expire in 10 minutes.</p>
    `
  });

  console.log("✅ Reset email sent to:", email);
};
const sendPasswordChangedEmail = async (email) => {
  await sendBrevoEmail({
    to: email,
    senderName: "CineVerse Security",
    subject: "Your CineVerse Password Was Changed ✅",
    htmlContent: `
      <div style="
        background:#0b0b0b;
        padding:50px;
        font-family:Arial,sans-serif;
        color:white;
        border-radius:16px;
      ">

        <h1 style="
          color:#e50914;
          font-size:42px;
          letter-spacing:3px;
        ">
          CINEVERSE
        </h1>

        <h2>Password Changed Successfully ✅</h2>

        <p style="
          color:#cfcfcf;
          line-height:1.8;
          font-size:16px;
        ">
          Your CineVerse password has been changed successfully.
        </p>

        <div style="
          background:#161616;
          padding:20px;
          border-radius:10px;
          margin-top:25px;
          border-left:4px solid #00c853;
        ">
          🔒 Your account is now secured with the new password.
        </div>

        <p style="
          margin-top:35px;
          color:#888;
          font-size:14px;
        ">
          If this was not you, please reset your password immediately.
        </p>

      </div>
    `
  });

  console.log("✅ Password changed email sent");
};

module.exports = {
  sendWelcomeEmail,
  sendResetEmail,
  sendPasswordChangedEmail
};
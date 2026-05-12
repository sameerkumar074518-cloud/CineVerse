const nodemailer = require("nodemailer");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const sendWelcomeEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

console.log("Trying to send reset email to:", email);
console.log("SMTP HOST:", process.env.SMTP_HOST);
console.log("SMTP USER:", process.env.SMTP_USER);

    await transporter.sendMail({
     from: `"CineVerse" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to CineVerse 🎬",
      html: `
  <div style="
    background:#141414;
    color:white;
    padding:40px;
    font-family:Arial,sans-serif;
    border-radius:12px;
  ">

    <h1 style="
      color:#e50914;
      font-size:38px;
      margin-bottom:10px;
      letter-spacing:2px;
    ">
      CINEVERSE
    </h1>

    <h2 style="
      margin-top:0;
      color:white;
      font-size:24px;
    ">
      Welcome to CineVerse 🎬
    </h2>

    <p style="
      color:#d2d2d2;
      font-size:16px;
      line-height:1.7;
    ">
      Your CineVerse account has been successfully created.
    </p>

    <div style="
      background:#1f1f1f;
      padding:20px;
      border-radius:10px;
      margin:25px 0;
      border-left:4px solid #e50914;
    ">
      <p style="margin:0 0 10px 0;">✅ Unlimited Movies & Series</p>
      <p style="margin:0 0 10px 0;">✅ Continue Watching</p>
      <p style="margin:0 0 10px 0;">✅ Personal Profiles</p>
      <p style="margin:0;">✅ My List & Premium Experience</p>
    </div>

    <p style="
      color:#aaa;
      font-size:15px;
      line-height:1.6;
    ">
      Experience cinema the way it was meant to be.
    </p>

    <a
      href="https://cineverse-hub-site.netlify.app/"
      style="
        display:inline-block;
        margin-top:20px;
        background:#e50914;
        color:white;
        padding:14px 28px;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
      "
    >
      Start Watching
    </a>

    <p style="
      margin-top:40px;
      color:#666;
      font-size:13px;
    ">
      © CineVerse Global
    </p>

  </div>
`
    });

    console.log("✅ Welcome email sent to:", email);
  } catch (err) {
  console.log("❌ Email sending error:", err.message);
  throw err;
}
};

const sendResetEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

    await transporter.sendMail({
      from: `"CineVerse Security" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your CineVerse Password 🔒",
      html: `
        <div style="
          background:#141414;
          color:white;
          padding:40px;
          font-family:Arial,sans-serif;
          border-radius:12px;
        ">

          <h1 style="
            color:#e50914;
            font-size:38px;
            margin-bottom:10px;
            letter-spacing:2px;
          ">
            CINEVERSE
          </h1>

          <h2 style="margin-top:0;">
            Password Reset Request
          </h2>

          <p style="
            color:#d2d2d2;
            font-size:16px;
            line-height:1.7;
          ">
            We received a request to reset your CineVerse password.
          </p>

          <div style="
            background:#1f1f1f;
            padding:25px;
            border-radius:10px;
            margin:30px 0;
            text-align:center;
            border:1px solid #333;
          ">
            <p style="
              color:#aaa;
              margin-bottom:10px;
            ">
              Your reset code
            </p>

            <h1 style="
              color:#e50914;
              font-size:42px;
              letter-spacing:8px;
              margin:0;
            ">
              ${code}
            </h1>
          </div>

          <p style="
            color:#aaa;
            font-size:14px;
            line-height:1.6;
          ">
            This code will expire in 10 minutes.
          </p>

          <p style="
            color:#666;
            font-size:13px;
            margin-top:35px;
          ">
            If you did not request this, you can safely ignore this email.
          </p>

        </div>
      `
    });

    console.log("✅ Reset email sent to:", email);

  } catch (err) {
  console.log("❌ Reset email error:", err.message);
  throw err;
}
};

module.exports = {
  sendWelcomeEmail,
  sendResetEmail
};
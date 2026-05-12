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
      <h1 style="color:#e50914;">CINEVERSE</h1>
      <h2>Welcome to CineVerse 🎬</h2>
      <p>Your CineVerse account has been successfully created.</p>
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

module.exports = {
  sendWelcomeEmail,
  sendResetEmail
};
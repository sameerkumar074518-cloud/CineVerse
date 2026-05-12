const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sender = {
  name: "CineVerse",
  email: process.env.EMAIL_FROM
};

const sendWelcomeEmail = async (email) => {
  const sendSmtpEmail = {
    sender,
    to: [{ email }],
    subject: "Welcome to CineVerse 🎬",
    htmlContent: `
      <h1 style="color:#e50914;">CINEVERSE</h1>
      <h2>Welcome to CineVerse 🎬</h2>
      <p>Your CineVerse account has been successfully created.</p>
    `
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log("✅ Welcome email sent to:", email);
};

const sendResetEmail = async (email, code) => {
  const sendSmtpEmail = {
    sender: {
      name: "CineVerse Security",
      email: process.env.EMAIL_FROM
    },
    to: [{ email }],
    subject: "Reset Your CineVerse Password 🔒",
    htmlContent: `
      <h1 style="color:#e50914;">CINEVERSE</h1>
      <h2>Password Reset Request</h2>
      <p>Your reset code is:</p>
      <h1 style="letter-spacing:8px;color:#e50914;">${code}</h1>
      <p>This code will expire in 10 minutes.</p>
    `
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log("✅ Reset email sent to:", email);
};

module.exports = {
  sendWelcomeEmail,
  sendResetEmail
};
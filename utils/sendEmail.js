import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.log("Email error:", error.message);
  }
};

export default sendEmail;
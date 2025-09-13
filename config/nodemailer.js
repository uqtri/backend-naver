import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sender = '"Jewelry Store" <khanhngoc230705@gmail.com>';

export const sendVerificationEmail = async (client, verificationToken) => {
  const mailContent = {
    from: sender,
    to: client,
    subject: "Email Confirmation",
    html: `
    <div>Hello,</div>
    <div>Thank you for signing up! Your verification code is:</div>
    <div style="font-size: 20px; font-weight: bold; color: #ff6600;">${verificationToken}</div>
    <div>Enter this code on the verification page to complete your registration. Please remember that this verification code will be expire in 5 minutes.</div>
    <br>
    <div>Best Regards,</div>
    <div><strong>Jewelry Store</strong></div>
  `,
  };

  transport.sendMail(mailContent, (err, res) => {
    if (err) {
      console.log("Error sending mail:", err);
    } else {
      console.log("Mail sent");
    }
  });
};

export const sendResetPasswordEmail = async (client, resetPasswordToken) => {
  const mailContent = {
    from: sender,
    to: client,
    subject: "Reset Password",
    html: `
  <div>Hello,</div>

  <div>You recently requested to reset your password. Click 
    <a href='http://localhost:5000/api/auth/reset-password/${resetPasswordToken}'>here</a> 
    to proceed.
  </div>

  <div>Enter this code on the password reset page to set up a new password. 
    Please remember that this password reset link will expire in 5 minutes.
  </div>

  <div>If you did not request this, please ignore this email. Your password will remain unchanged.</div>

  <br>

  <div>Best Regards,</div>
  <div><strong>Jewelry Store</strong></div>
`,
  };

  transport.sendMail(mailContent, (err, res) => {
    if (err) {
      console.log("Error sending mail:", err);
    } else {
      console.log("Mail sent");
    }
  });
};

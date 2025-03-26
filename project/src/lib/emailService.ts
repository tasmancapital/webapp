import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.VITE_EMAIL_USER,
    pass: process.env.VITE_EMAIL_PASS,
  },
});

interface EmailData {
  name: string;
  email: string;
  message: string;
}

export const sendEmail = async (data: EmailData) => {
  const { name, email, message } = data;

  const mailOptions = {
    from: process.env.VITE_EMAIL_USER,
    to: 'info@tasmancapital.com.au',
    replyTo: email,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: 'Failed to send email' };
  }
};
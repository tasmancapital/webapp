import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

// Create reusable transporter with updated Office 365 config
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.VITE_EMAIL_USER,
    pass: process.env.VITE_EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: true, // Enable certificate validation
    minVersion: 'TLSv1.2' // Force TLS 1.2
  },
  pool: true, // Use connection pool
  maxConnections: 5,
  maxMessages: 100
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse and validate input
    const { name, email, message } = JSON.parse(event.body || '{}');

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Verify connection before sending
    await transporter.verify();

    // Send email with proper Office 365 formatting
    const info = await transporter.sendMail({
      from: {
        name: 'Tasman Capital Website',
        address: 'noreply@tasmancapital.com.au'
      },
      to: 'enquiries@tasmancapital.com.au',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `.trim(),
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId
      })
    };

  } catch (error) {
    console.error('Email error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
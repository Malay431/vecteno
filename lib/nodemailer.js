import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // or smtp.sendinblue.com
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // your Brevo SMTP user
    pass: process.env.SMTP_PASS, // your Brevo SMTP password
  },
});

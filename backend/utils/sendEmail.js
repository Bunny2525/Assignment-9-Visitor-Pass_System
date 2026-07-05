const nodemailer = require('nodemailer');

// This utility function handles sending real emails using Gmail
const sendEmail = async (userEmail, subject, messageText) => {
  try {
    // 1. Configure the email transport service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 2. Set up who it is from, who it goes to, and the content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      text: messageText
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
    console.log("Real email sent successfully to: " + userEmail);
    
    return true; // Return true so our controller knows it worked

  } catch (error) {
    console.log("Failed to send email. Error: " + error.message);
    return false; 
  }
};

module.exports = sendEmail;
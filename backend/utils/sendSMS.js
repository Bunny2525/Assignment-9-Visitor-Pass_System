const twilio = require('twilio');

const sendSMS = async (phoneNumber, messageBody) => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = sendSMS;
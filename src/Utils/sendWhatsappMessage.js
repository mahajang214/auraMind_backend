const axios = require('axios');

const sendWhatsAppMessage = async (to, message) => {
  const token = 'YOUR_PERMANENT_ACCESS_TOKEN';
  const phoneNumberId = 'YOUR_PHONE_NUMBER_ID';

  try {
    const res = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to, // e.g. "919876543210"
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Message sent:', res.data);
  } catch (err) {
    console.error('Error sending WhatsApp message:', err.response.data);
  }
};

sendWhatsAppMessage('919179233131', 'Hello from AuraMind! This is a test message.');


module.exports = sendWhatsAppMessage;


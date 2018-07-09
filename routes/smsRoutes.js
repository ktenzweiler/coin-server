// smsRoutes.js
const smsService = require('../services/smsServices');

//SMS-related routes
exports.configure = (app) => {
  // Test route to ensure API successfully sends a SMS alarm to your phone
  app.get('/api/sms/test', sendSmsTest);

};

// Send an SMS test message
function sendSmsTest(req, res, done) {

  smsService.sendSms('This is a test message from our Node.js app!', () => {
    console.log('successfully sent a sms message');

    res.json({
      success:true
    });
  });
  
}

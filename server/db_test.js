const dbRunner = require("./db.js");
const otpService = require("./service/otp_service.js");

(async () => {
  // const otpGenerated = await otpService.generateOtp("123");
  // console.log("otpGenerated: " + otpGenerated);
  const otpVerified = await otpService.verifyOtp("123", "448883");
  console.log("otpVerified: " + otpVerified);
})();

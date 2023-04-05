const OTP = require("@universal-packages/time-based-one-time-password");
const db = require("../db.js");
const { deleteOtp } = require("../db");
const LoginService = require("../service/login_service");
const nodemailer = require("nodemailer");

const dummyKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

const client = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bjorn.agnemo@gmail.com",
    pass: "sxlbeqepydtzrnkf",
  },
});

// Generate a new one time password and store it in the database table otp
const generateOtp = async (botId, email) => {
  // check if an otp already exists for this botId, and if so delete it
  const oldOtp = await db.getOtp(botId);
  if (oldOtp) {
    console.log("Deleting old otp");
    console.log(oldOtp);
    await db.deleteOtp(botId);
  }

  const otp = OTP.generate(dummyKey, { timeStep: 300 });
  await db.insertOtp(botId, otp, email);
  await client.sendMail({
    from: "Koala Mailer",
    to: email,
    subject: "Your Koala OTP",
    text: `Your OTP is ${otp}`,
  });

  return otp;
};

// Verify the user's input against the otp stored in the database
const verifyOtp = async (botId, userOtp) => {
  const otpObj = await db.getOtp(botId);
  if (!otpObj) {
    throw new Error("No otp found for this bot id");
  }
  const otp = otpObj.otp;
  if (userOtp !== otp) {
    return { valid: false, message: "wrong password" };
  }
  const valid = OTP.verify(userOtp, dummyKey, { timeStep: 300 });
  await deleteOtp(botId);
  const message = valid ? "correct password" : "expired password";
  return { valid, message };
};

const generateOtpResponse = async (email) => {
  const token = await db.getTokenByEmail(email);
  if (!token) {
    return { valid: false, message: "email not found" };
  }
  const botId = token.bot_id;
  const otp = await generateOtp(botId, email);
  return { valid: true, message: "otp generated", email: email, otp: otp };
};

const signInByOtp = async (email, otp) => {
  const token = await db.getTokenByEmail(email);
  if (!token) {
    throw new Error("email not found");
  }
  const validOtp = await verifyOtp(token.bot_id, otp);
  if (!validOtp.valid) {
    return { valid: false, message: validOtp.message };
  }
  return await LoginService.signIn(token.bot_id);
};

module.exports = { verifyOtp, generateOtp, generateOtpResponse, signInByOtp };

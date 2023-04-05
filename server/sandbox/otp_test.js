const OTP = require("one-time-password");

const dummyKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

// const dummyToken = OTP.generate(dummyKey);
// console.log(dummyToken);
console.log(OTP.verify(dummyKey, "448883"));
console.log(OTP.verify(dummyKey, dummyToken));

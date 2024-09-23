const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.NODEMAILER_EMAIL,
//     pass: process.env.NODEMAILER_PASSWORD,
//   },
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahammedijas7885@gmail.com",
    pass: "wsau wond lzgf xowd",
  },
});

const sendOTP = async (email, otp) => {
  const sendedMail = await transporter.sendMail({
    from: "ahammedijas7885@gmail.com",
    to: email,
    subject: "Your OTP for Signup",
    text: `Your OTP is: ${otp}`,
  });
  console.log(sendedMail);
};

module.exports = sendOTP;

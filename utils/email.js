

const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.QQ,
      pass: process.env.QQ_PASS
    }
  });
  //2. Define the email options
  const mailOptions = {
    from: `裴俊磊 ${process.env.QQ}`,
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
  console.log('mailOptions===>', mailOptions)
  //3. Actually send the email
  await transporter.sendMail(mailOptions);

}


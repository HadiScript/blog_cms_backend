const nodeMailer = require("nodemailer");

const SendEmailWithNodemailer = (req, res, emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "mail.hadiraza.com",
    port: 465,
    secure: true,
    auth: {
      user: "contact@hadiraza.com",
      pass: "4234Hadi..",
    },
    tls: { rejectUnauthorized: false },
  });

  return transporter
    .sendMail(emailData)
    .then((info) => {
      console.log(`Message sent: ${info.response}`);
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));
};

module.exports = {
  SendEmailWithNodemailer,
};

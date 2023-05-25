const nodemailer = require("nodemailer");
const { SendEmailWithNodemailer } = require("../helpers/SendingEmail");

const contact = async (req, res) => {
  const { name, email, message } = req.body;
  const emailData = {
    from: "contact@hadiraza.com",
    to: email,
    subject: "Thanks for your message.",
    text: `Hi ${name},`,
    html: `<h4>Thank You For subscribe hadiraza:</h4>
             <hr />
             <p>Visit my site</p>
             <a href="https://hadiraza.com/" target="_blank">hadiraza.com</a>
            `,
  };
  try {
    SendEmailWithNodemailer(req, res, emailData);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  contact,
};

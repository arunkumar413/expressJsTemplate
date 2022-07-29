module.exports.styledConsole = function (item, text) {
  console.clear();
  console.log(`############   ${text}   ##########`);
  console.log(item);
  console.log(`############   ${text}   ##########`);
};


async function sendVerificationEmail(info) {

  try {

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_VERIFICATION_HOST,
      port: process.env.EMAIL_VERIFICATION_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_VERIFICATION_USER_NAME,
        pass: process.env.EMAIL_VERIFICATION_PASSWORD,
      },
    });

    let emailBodyText = `
  Hi There,

  Thanks for registering an account with us:

  Please verify your account by clicking the link below:
  
  http://localhost:5000/${v4()}
  
  Regards,
  Express App Team

  `
    let info = await transporter.sendMail({
      from: '"noreply" <arunkumar413@zohomail.in>',
      to: "arunkumar413@gmail.com",
      subject: "verify your email",
      text: emailBodyText,
      // html: "<b>Hello world?</b>", // html body
    });
  } catch (err) {
    console.log(err)
  }
}

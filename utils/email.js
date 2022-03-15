const nodemailer = require('nodemailer');

const pass = process.env.EMAIL_PASS;


const mail = async (email, message) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'wordleinapp@gmail.com',
            pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Wordle" <wordleinapp@gmail.com',
        to: email,
        subject: 'Important message',
        text: message,
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = mail;

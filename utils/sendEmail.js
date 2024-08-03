const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Send an email
 * @param {String} to - Recipient email address
 * @param {String} subject - Email subject
 * @param {String} text - Email text content
 * @param {String} html - Email HTML content (optional)
 */
const sendEmail = async (to, subject, text, html = '') => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = {
    sendEmail
};

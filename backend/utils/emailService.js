const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER || 'test@ethereal.email', // Replace with real email
        pass: process.env.EMAIL_PASS || 'testpassword'         // Replace with real password
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Al-Amal Pharmacy" <no-reply@alamalpharmacy.com>',
            to,
            subject,
            text,
            html
        });
        console.log('Message sent: %s', info.messageId);
        // If using Ethereal, you can view it here: console.log(nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendEmail };

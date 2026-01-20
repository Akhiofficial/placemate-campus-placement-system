const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('----------------------------------------------------');
        console.log('WARNING: Email credentials not found in .env');
        console.log('Mocking email sending. Here is the email content:');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log('----------------------------------------------------');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // or host: 'smtp.mailtrap.io', port: 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'noreply@placemate.com'} <${process.env.FROM_EMAIL || 'noreply@placemate.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;

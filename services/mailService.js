const nodemailer = require('nodemailer');

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASS;

if (!user || !pass) {
    console.warn('WARNING: GMAIL_USER or GMAIL_PASS is missing in environment variables. Email sending will fail.');
} else {
    console.log(`Email service initialized with user: ${user}`);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass
    }
});

const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${otp}`,
        html: `<h3>Your Verification Code</h3><p>Please use the following code to verify your identity: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${to}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

const sendTemplateLink = async (to, link) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: 'Document for Review',
        text: `Please review/sign the document here: ${link}`,
        html: `<h3>Document for Review</h3><p>We have prepared a document for you. Please click the link below to verify your identity and review/sign it:</p><p><a href="${link}">View Document</a></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Template link sent to ${to}`);
    } catch (error) {
        console.error('Error sending template link:', error);
        throw error;
    }
};

module.exports = {
    sendOtpEmail,
    sendTemplateLink,

    sendSubmissionReceipt: async (to, name, attachments = []) => {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: to,
            subject: 'Submission Received & Signed Document',
            html: `<h3>Submission Received</h3><p>Dear ${name},</p><p>Thank you for submitting your document. We have received your information.</p><p>Please find the generated document attached for your records.</p><p>We will review it and get back to you soon.</p>`,
            attachments: attachments
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Receipt sent to ${to} with ${attachments.length} attachments`);
        } catch (error) {
            console.error('Error sending receipt:', error);
        }
    },

    sendApplicationDecision: async (to, status, name) => {
        const isAccepted = status === 'Accepted';
        const subject = isAccepted ? 'Application Accepted' : 'Application Update';
        const color = isAccepted ? '#10b981' : '#ef4444';

        const html = isAccepted
            ? `<h3>Congratulations!</h3><p>Dear ${name},</p><p>We are pleased to inform you that your application has been <strong>ACCEPTED</strong>.</p><p>Please find the official countersigned document attached.</p><p>Welcome aboard!</p>`
            : `<h3>Application Update</h3><p>Dear ${name},</p><p>Thank you for your interest. After careful review, we regret to inform you that we are unable to proceed with your application at this time.</p><p>${status === 'Declined' ? 'Your application has been declined.' : ''}</p>`;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Decision email sent to ${to}`);
        } catch (error) {
            console.error('Error sending decision email:', error);
        }
    },

    sendInquiryThankYou: async (to, name, type = 'Inquiry') => {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: to,
            subject: 'We received your inquiry',
            html: `
                <h3>Thank You for Reaching Out</h3>
                <p>Dear ${name},</p>
                <p>We have received your request regarding <strong>${type}</strong>.</p>
                <p>One of our agents will review your message and get back to you as soon as possible.</p>
                <br>
                <p>Best regards,</p>
                <p>The Estate Team</p>
            `
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Inquiry Thank You sent to ${to}`);
        } catch (error) {
            console.error('Error sending inquiry thank you:', error);
        }
    }
};

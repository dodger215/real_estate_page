const Lead = require('../models/Lead');
const Submission = require('../models/Submission');
const Template = require('../models/Template');
const SiteSettings = require('../models/SiteSettings');
const pdfService = require('../services/pdfService');
const { sendOtpEmail, sendSubmissionReceipt } = require('../services/mailService');
const otpGenerator = require('otp-generator');

// View rendering methods
exports.renderDocumentView = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (submission && submission.status === 'Submitted') {
            const settings = await SiteSettings.findOne();
            return res.render('document-view', {
                submissionId: req.params.id,
                settings: settings || {},
                isPublicView: true,
                error: 'This document has already been submitted and is no longer accessible.'
            });
        }

        const settings = await SiteSettings.findOne();
        res.render('document-view', {
            submissionId: req.params.id,
            settings: settings || {},
            isPublicView: true
        });
    } catch (err) {
        res.status(500).send('Error loading page');
    }
};

exports.renderVerifyView = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (submission && submission.status === 'Submitted') {
            return res.status(403).send('Link expired: This document has already been submitted.');
        }

        const settings = await SiteSettings.findOne();
        res.render('lead-verify', {
            submissionId: req.params.id,
            settings: settings || {},
            isPublicView: true
        });
    } catch (err) {
        res.status(500).send('Error loading page');
    }
};

exports.requestOtp = async (req, res) => {
    const { submissionId } = req.body;
    try {
        const submission = await Submission.findById(submissionId).populate('lead');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        // Security check: Don't allow OTP requests for already submitted documents
        if (submission.status === 'Submitted') {
            return res.status(403).json({ message: 'This document has already been submitted.' });
        }

        const lead = submission.lead;

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        lead.otp = otp;
        lead.otpExpires = expires;
        await lead.save();

        await sendOtpEmail(lead.email, otp);

        res.json({ message: 'OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { submissionId, otp } = req.body;
    try {
        const submission = await Submission.findById(submissionId).populate('lead');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        // Security check: Don't allow verification for already submitted documents
        if (submission.status === 'Submitted') {
            return res.status(403).json({ message: 'This document has already been submitted.' });
        }

        const lead = submission.lead;

        if (lead.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (lead.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        lead.isVerified = true;
        lead.otp = undefined;
        lead.otpExpires = undefined;
        await lead.save();

        // Return submission with template details
        const template = await Template.findById(submission.template);

        res.json({
            message: 'Verified successfully',
            submission,
            template
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSubmissionData = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('lead')
            .populate('template');

        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        // Check verification status
        if (!submission.lead.isVerified) {
            return res.status(403).json({ message: 'Not verified' });
        }

        // Check if already submitted
        if (submission.status === 'Submitted') {
            return res.status(410).json({ message: 'This document has already been submitted and can no longer be accessed.' });
        }

        res.json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.submitForm = async (req, res) => {
    const { submissionId, values } = req.body;
    try {
        const submission = await Submission.findById(submissionId).populate('lead');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        // Prevent double submission
        if (submission.status === 'Submitted') {
            return res.status(403).json({ message: 'Already submitted' });
        }

        submission.values = values;
        submission.status = 'Submitted';
        submission.submittedAt = new Date();
        await submission.save();

        // Generate PDF
        const template = await Template.findById(submission.template);
        const settings = await SiteSettings.findOne();

        let attachments = [];
        try {
            if (template && settings) {
                const pdfBuffer = await pdfService.generateSubmissionPdf(submission, template, settings);
                attachments.push({
                    filename: `${template.name.replace(/[^a-z0-9]/gi, '_')}_Signed.pdf`,
                    content: pdfBuffer
                });
            }
        } catch (pdfErr) {
            console.error('Failed to generate PDF:', pdfErr);
            // Continue to send email without PDF if failure
        }

        // Send Receipt Email
        await sendSubmissionReceipt(submission.lead.email, submission.lead.name, attachments);

        res.json({ message: 'Form submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const Template = require('../models/Template');
const Lead = require('../models/Lead');
const Submission = require('../models/Submission');
const SiteSettings = require('../models/SiteSettings'); // Added
const pdfService = require('../services/pdfService'); // Added
const { sendTemplateLink, sendOtpEmail, sendApplicationDecision } = require('../services/mailService');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');

// Templates CRUD
exports.getTemplates = async (req, res) => {
    try {
        const templates = await Template.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.json(templates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTemplate = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) return res.status(404).json({ message: 'Template not found' });
        res.json(template);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTemplate = async (req, res) => {
    try {
        const template = new Template({
            ...req.body,
            createdBy: req.user.id
        });
        await template.save();
        res.status(201).json(template);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(template);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteTemplate = async (req, res) => {
    try {
        // Soft delete
        await Template.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json({ message: 'Template deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Send Template to Lead
exports.sendToLead = async (req, res) => {
    const { templateId, leadId } = req.body;
    try {
        const lead = await Lead.findById(leadId);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        // Generate Submission Record (Pending)
        const submission = new Submission({
            lead: leadId,
            template: templateId,
            status: 'Pending',
            token: crypto.randomBytes(32).toString('hex')
        });
        await submission.save();

        // Send Email
        // The link should point to the frontend public verify page with the submission ID/Token
        // We usually send a link to: BASE_URL/public/verify/{submissionId}
        // When they open that link, they see "Click to send OTP" or "Enter OTP" (if sent)
        // Let's assume we send the link, and when they land, they request OTP.

        // OR we generate OTP now? No, better to verify on demand to avoid expiry before they open email.
        // So we just send the unique link.

        const link = `http://localhost:5000/public/verify/${submission._id}`; // Updated to server EJS view
        await sendTemplateLink(lead.email, link);

        res.json({ message: 'Template sent to lead', submissionId: submission._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Submissions (Admin View)
exports.getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('lead', 'name email')
            .populate('template', 'name')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.reviewSubmission = async (req, res) => {
    const { status, adminFeedback } = req.body; // status: 'Accepted' or 'Declined'
    try {
        const submission = await Submission.findByIdAndUpdate(req.params.id, {
            status,
            adminFeedback
        }, { new: true })
            .populate('lead')
            .populate('template');

        if (submission && submission.lead) {
            let attachments = [];

            // If Accepted, generate and attach the signed PDF
            if (status === 'Accepted') {
                try {
                    const settings = await SiteSettings.findOne();
                    // Assuming submission.template is populated as an object
                    if (submission.template && settings) {
                        const pdfBuffer = await pdfService.generateSubmissionPdf(submission, submission.template, settings);
                        attachments.push({
                            filename: `${submission.template.name.replace(/[^a-z0-9]/gi, '_')}_Final.pdf`,
                            content: pdfBuffer
                        });
                    }
                } catch (pdfErr) {
                    console.error('Error generating PDF for acceptance:', pdfErr);
                }
            }

            await sendApplicationDecision(submission.lead.email, status, submission.lead.name, attachments);
        }

        res.json(submission);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

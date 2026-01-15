const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    values: { type: Object, default: {} }, // The filled form data
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Accepted', 'Declined'],
        default: 'Pending'
    },
    adminFeedback: String,
    submittedAt: Date,
    token: String, // Unique token for accessing this submission publicly
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);

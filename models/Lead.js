const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: String,
    type: { type: String, enum: ['General', 'Viewing', 'Information'], default: 'General' },
    preferredDate: Date,
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    status: { type: String, enum: ['new', 'contacted', 'assigned', 'closed'], default: 'new' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    source: String, // e.g. 'hero_form', 'footer_form'
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);

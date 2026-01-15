const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: String,
    bio: String,
    photo: String,
    phone: String,
    whatsapp: String,
    email: String,
    experience: String,
    socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    deletedAt: { type: Date, default: null },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);

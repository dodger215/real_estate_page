const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    siteName: String,
    logo: String,
    favicon: String,
    adminSignature: { type: String },
    enableAdminSignature: { type: Boolean, default: false },
    primaryColor: {
        type: String,
        default: '#1890ff'
    },
    contactPhone: String,
    whatsappNumber: String,
    email: String,
    officeAddress: String,
    socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        googleAnalyticsId: String,
        facebookPixelId: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

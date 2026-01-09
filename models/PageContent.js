const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
    hero: {
        headline: String,
        subheadline: String,
        backgroundImage: String,
        ctaText: String,
        ctaAction: String, // 'form', 'phone', 'whatsapp'
        showBadge: { type: Boolean, default: true },
        badgeText: String
    },
    trustSignals: {
        badges: [String],
        partners: [String],
        yearsExperience: String,
        homesSold: String
    },
    property: {
        title: String,
        type: String,
        location: String,
        description: String,
        status: String,
        size: String,
        bedrooms: Number,
        bathrooms: Number,
        parking: String,
        price: String,
        priceRange: String
    },
    media: {
        gallery: [String],
        floorPlans: [String],
        videoTour: String,
        enabled: { type: Boolean, default: true }
    },
    features: [{
        name: String,
        icon: String,
        enabled: { type: Boolean, default: true }
    }],
    location: {
        mapEmbed: String,
        address: String,
        landmarks: [{ name: String, distance: String }],
        neighborhoodDescription: String
    },
    paymentPlans: [{
        title: String,
        description: String
    }],
    testimonials: [{
        name: String,
        content: String,
        rating: Number,
        image: String,
        enabled: { type: Boolean, default: true }
    }],
    faq: [{
        question: String,
        answer: String,
        enabled: { type: Boolean, default: true }
    }],
    footer: {
        text: String,
        legalLinks: [{ label: String, url: String }],
        copyright: String
    },
    about: {
        title: String,
        content: String,
        image: String,
        mission: String,
        vision: String
    },
    contactPage: {
        title: String,
        description: String,
        officeLocation: String,
        mapEmbed: String
    },
    testimonials: [{
        name: String,
        role: String,
        content: String,
        avatar: String
    }],
    faq: [{
        question: String,
        answer: String
    }],
    layout: [String] // Order of sections
}, { timestamps: true });

module.exports = mongoose.model('PageContent', pageContentSchema);

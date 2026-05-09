const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    type: { type: String, enum: ['Apartment', 'Land', 'Commercial', 'Villa', 'Office'], required: true },
    status: { type: String, enum: ['Off-plan', 'Ready', 'Sold', 'Rent'], default: 'Ready' },
    location: { type: String, required: true },
    description: String,
    price: Number,
    priceRange: String,
    size: String,
    bedrooms: Number,
    bathrooms: Number,
    parking: String,
    images: [String],
    featuredImage: String,
    floorPlans: [String],
    videoTour: String,
    amenities: [String],
    locationFeatures: [String],
    mapEmbed: String,
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);

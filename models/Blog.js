const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: String,
    excerpt: String,
    author: String, 
    featuredImage: String,
    category: String,
    tags: [String],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
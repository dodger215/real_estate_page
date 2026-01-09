const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['Ongoing', 'Completed', 'Upcoming'], default: 'Ongoing' },
    location: String,
    image: String,
    completionDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

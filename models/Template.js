const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }, // Context/summary for the lead
    imageUrl: { type: String }, // Header image for the form
    content: { type: String, required: true }, // The Documentation / Rich Text part
    formSchema: { type: Array, default: [] }, // JSON for the Form Builder fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false } // Soft delete for consistency
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);

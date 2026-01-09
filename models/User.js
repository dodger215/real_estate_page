// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'agent'], default: 'editor' },
    permissions: {
        content: { type: Boolean, default: false },
        media: { type: Boolean, default: false },
        leads: { type: Boolean, default: false },
        users: { type: Boolean, default: false }
    }
}, { timestamps: true });

// Use async/await style without next
userSchema.pre('save', async function() {
    // Only hash the password if it's modified or new
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
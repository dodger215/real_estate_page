const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

// Submit lead (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message, propertyId, type, preferredDate } = req.body;
        const lead = new Lead({
            name,
            email,
            phone,
            message,
            property: propertyId || null,
            type: type || 'General',
            preferredDate: preferredDate || null
        });
        await lead.save();
        res.status(201).json({ message: 'Lead submitted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all leads (Auth)
router.get('/', auth, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update lead status (Auth)
router.patch('/:id', auth, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

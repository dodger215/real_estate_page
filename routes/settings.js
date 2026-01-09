const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');

// Get settings
router.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne();
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update settings
router.post('/', auth, async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (settings) {
            settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
        } else {
            settings = new SiteSettings(req.body);
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

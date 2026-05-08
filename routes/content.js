const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const auth = require('../middleware/auth');

// Get content
router.get('/', async (req, res) => {
    try {
        const content = await PageContent.findOne();
        res.json(content || {});
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update content
router.post('/', auth, async (req, res) => {
    try {
        let content = await PageContent.findOne();
        if (content) {
            content = await PageContent.findByIdAndUpdate(content._id, req.body, { new: true });
        } else {
            content = new PageContent(req.body);
            await content.save();
        }
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update specific contact page content
router.patch('/contact', auth, async (req, res) => {
    try {
        let content = await PageContent.findOne();
        if (!content) {
            content = new PageContent({ contactPage: req.body });
            await content.save();
        } else {
            content.contactPage = { ...content.contactPage.toObject(), ...req.body };
            await content.save();
        }
        res.json(content.contactPage);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update home page location section
router.patch('/location', auth, async (req, res) => {
    try {
        let content = await PageContent.findOne();
        if (!content) {
            content = new PageContent({ location: req.body });
            await content.save();
        } else {
            content.location = { ...content.location.toObject(), ...req.body };
            await content.save();
        }
        res.json(content.location);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

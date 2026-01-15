const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const auth = require('../middleware/auth');

// Templates CRUD
router.get('/', auth, templateController.getTemplates);
router.get('/:id', auth, templateController.getTemplate);
router.post('/', auth, templateController.createTemplate);
router.patch('/:id', auth, templateController.updateTemplate);
router.delete('/:id', auth, templateController.deleteTemplate);

// Actions
router.post('/send', auth, templateController.sendToLead);

// Submissions (Admin)
router.get('/submissions/all', auth, templateController.getSubmissions);
router.patch('/submissions/:id', auth, templateController.reviewSubmission);

module.exports = router;

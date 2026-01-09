const express = require('express');
const router = express.Router();
const editorController = require('../controllers/editorController');
const auth = require('../middleware/auth');

// Properties
router.get('/properties', editorController.getProperties);
router.get('/properties/:id', editorController.getProperty);
router.post('/properties', auth, editorController.createProperty);
router.patch('/properties/:id', auth, editorController.updateProperty);
router.delete('/properties/:id', auth, editorController.deleteProperty);

// Blogs
router.get('/blogs', editorController.getBlogs);
router.get('/blogs/:id', editorController.getBlog);
router.post('/blogs', auth, editorController.createBlog);
router.patch('/blogs/:id', auth, editorController.updateBlog);
router.delete('/blogs/:id', auth, editorController.deleteBlog);

// Agents
router.get('/agents', editorController.getAgents);
router.get('/agents/:id', editorController.getAgent);
router.post('/agents', auth, editorController.createAgent);
router.patch('/agents/:id', auth, editorController.updateAgent);
router.delete('/agents/:id', auth, editorController.deleteAgent);

// Services
router.get('/services', editorController.getServices);
router.post('/services', auth, editorController.createService);
router.patch('/services/:id', auth, editorController.updateService);
router.delete('/services/:id', auth, editorController.deleteService);

// Projects
router.get('/projects', editorController.getProjects);
router.post('/projects', auth, editorController.createProject);
router.patch('/projects/:id', auth, editorController.updateProject);
router.delete('/projects/:id', auth, editorController.deleteProject);

module.exports = router;

const Property = require('../models/Property');
const Blog = require('../models/Blog');
const Agent = require('../models/Agent');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Lead = require('../models/Lead');

/**
 * Generic CRUD Controller Class
 */
class CrudController {
    constructor(Model) {
        this.Model = Model;
    }

    getAll = async (req, res) => {
        try {
            const filter = {};
            if (this.Model.schema.path('deletedAt')) {
                filter.deletedAt = null;
            }
            const items = await this.Model.find(filter).sort({ createdAt: -1 });
            res.json(items);
        } catch (err) {
            res.status(500).json({ message: `Error fetching items: ${err.message}` });
        }
    };

    getOne = async (req, res) => {
        try {
            const item = await this.Model.findById(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (err) {
            res.status(500).json({ message: `Error fetching item: ${err.message}` });
        }
    };

    create = async (req, res) => {
        try {
            const item = new this.Model(req.body);
            await item.save();
            res.status(201).json(item);
        } catch (err) {
            res.status(400).json({ message: `Error creating item: ${err.message}` });
        }
    };

    update = async (req, res) => {
        try {
            const item = await this.Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (err) {
            res.status(400).json({ message: `Error updating item: ${err.message}` });
        }
    };

    delete = async (req, res) => {
        try {
            if (this.Model.schema.path('deletedAt')) {
                // Soft delete
                const item = await this.Model.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
                if (!item) return res.status(404).json({ message: 'Item not found' });
                res.json({ message: 'Moved to recycle bin' });
            } else {
                // Hard delete
                const item = await this.Model.findByIdAndDelete(req.params.id);
                if (!item) return res.status(404).json({ message: 'Item not found' });
                res.json({ message: 'Deleted successfully' });
            }
        } catch (err) {
            res.status(500).json({ message: `Error deleting item: ${err.message}` });
        }
    };

    // Recycle Bin methods
    getDeleted = async (req, res) => {
        try {
            if (!this.Model.schema.path('deletedAt')) {
                return res.status(400).json({ message: 'This resource does not support recycle bin' });
            }
            const items = await this.Model.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
            res.json(items);
        } catch (err) {
            res.status(500).json({ message: `Error fetching deleted items: ${err.message}`, stack: err.stack });
            console.error('getDeleted Error:', err);
        }
    };

    restore = async (req, res) => {
        try {
            const item = await this.Model.findByIdAndUpdate(req.params.id, { deletedAt: null }, { new: true });
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (err) {
            res.status(500).json({ message: `Error restoring item: ${err.message}` });
        }
    };

    permanentDelete = async (req, res) => {
        try {
            const item = await this.Model.findByIdAndDelete(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json({ message: 'Permanently deleted' });
        } catch (err) {
            res.status(500).json({ message: `Error permanently deleting item: ${err.message}` });
        }
    };
}

// Instantiate controllers for each model
const propertyController = new CrudController(Property);
const blogController = new CrudController(Blog);
const agentController = new CrudController(Agent);
const serviceController = new CrudController(Service);
const projectController = new CrudController(Project);
const leadController = new CrudController(Lead);

module.exports = {
    // Properties
    getProperties: propertyController.getAll,
    getProperty: propertyController.getOne,
    createProperty: propertyController.create,
    updateProperty: propertyController.update,
    deleteProperty: propertyController.delete,
    // Property Recycle Bin
    getDeletedProperties: propertyController.getDeleted,
    restoreProperty: propertyController.restore,
    permanentDeleteProperty: propertyController.permanentDelete,

    // Blogs
    getBlogs: blogController.getAll,
    getBlog: blogController.getOne,
    createBlog: blogController.create,
    updateBlog: blogController.update,
    deleteBlog: blogController.delete,

    // Agents
    getAgents: agentController.getAll,
    getAgent: agentController.getOne,
    createAgent: agentController.create,
    updateAgent: agentController.update,
    deleteAgent: agentController.delete,
    // Agent Recycle Bin
    getDeletedAgents: agentController.getDeleted,
    restoreAgent: agentController.restore,
    permanentDeleteAgent: agentController.permanentDelete,

    // Services
    getServices: serviceController.getAll,
    createService: serviceController.create,
    updateService: serviceController.update,
    deleteService: serviceController.delete,

    // Projects
    getProjects: projectController.getAll,
    createProject: projectController.create,
    updateProject: projectController.update,
    deleteProject: projectController.delete,

    // Leads
    getLeads: leadController.getAll,
    updateLead: leadController.update
};

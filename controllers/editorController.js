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
            const items = await this.Model.find().sort({ createdAt: -1 });
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
            const item = await this.Model.findByIdAndDelete(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json({ message: 'Deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: `Error deleting item: ${err.message}` });
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

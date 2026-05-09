require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const SiteSettings = require('./models/SiteSettings');
const PageContent = require('./models/PageContent');
const Property = require('./models/Property');
const Agent = require('./models/Agent');
const Blog = require('./models/Blog');

const app = express();

const expressLayouts = require('express-ejs-layouts');

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'https://benalb.online',
    'https://www.benalb.online',
    'http://localhost:5173',  // Vite admin dev
    'http://localhost:3000',
    'http://localhost:5000',
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (curl, Postman, same-origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions)); // Pre-flight for all routes (Express 5 syntax)


// ── Body parsers (increase limit for base64 / large payloads) ─────────────────
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Database Connection
mongoose.connect(
    process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const templateRoutes = require('./routes/templates');
const publicRoutes = require('./routes/public');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/content', require('./routes/content'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/users', require('./routes/users'));
app.use('/api/editor', require('./routes/editor'));
app.use('/api/upload', require('./routes/uploader'));
app.use('/api/templates', templateRoutes);
app.use('/api/public', publicRoutes);
app.use('/public', publicRoutes); // Mount public view routes


// Landing Page Route
app.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const content = await PageContent.findOne() || {};
        const featuredProperties = await Property.find({ isFeatured: true }).limit(3);
        res.render('index', { settings, content, featuredProperties });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Properties Listing
app.get('/properties', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const { type, status, minPrice, maxPrice } = req.query;
        let query = { isPublished: true };
        if (type) query.type = type;
        if (status) query.status = status;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        const properties = await Property.find(query).sort({ createdAt: -1 });
        res.render('properties', { settings, properties, filters: req.query });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Property Details
app.get('/properties/:slug', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const property = await Property.findOne({ slug: req.params.slug }).populate('agent');
        if (!property) return res.status(404).send('Property not found');
        res.render('property-details', { settings, property });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// About Us
app.get('/about', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const content = await PageContent.findOne() || {};
        const agents = await Agent.find({ isFeatured: true });
        res.render('about', {
            settings,
            aboutContent: content.about || {}, // Pass just the about part
            content: content, // Pass full content for footer
            agents
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Contact Us
app.get('/contact', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const content = await PageContent.findOne() || {};
        const agents = await Agent.find({ isFeatured: true }); // Add if needed
        res.render('contact', {
            settings,
            contactContent: content.contactPage || {}, // Specific contact content
            content: content, // Full content for footer
            agents // Add this if you want to show agents on contact page
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Blog
app.get('/blog', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const blogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
        res.render('blog', { settings, blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/blog/:slug', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name');
        if (!blog) return res.status(404).send('Post not found');
        res.render('blog-post', { settings, blog });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Services (Placeholder - assuming content from PageContent)
app.get('/services', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const content = await PageContent.findOne() || {};
        res.render('services', { settings, content: content.servicesPage });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


app.get('/thank-you', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        res.render('thank-you', { settings });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ── Global error handler (must be LAST middleware) ─────────────────────────
// This ensures CORS headers are present even when Express throws 413, 500 etc.
app.use((err, req, res, next) => {
    // Always add CORS headers so the browser can read the error body
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (err.type === 'entity.too.large' || err.status === 413) {
        return res.status(413).json({
            error: 'Payload Too Large',
            message: 'File size exceeds the server limit (100 MB). Please upload a smaller file.'
        });
    }

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS policy blocked this request.' });
    }

    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

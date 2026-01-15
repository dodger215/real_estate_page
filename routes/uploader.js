// routes/uploader.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create date-based subdirectory
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const subDir = path.join(uploadDir, `${year}/${month}/${day}`);

        if (!fs.existsSync(subDir)) {
            fs.mkdirSync(subDir, { recursive: true });
        }

        cb(null, subDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, sanitizedOriginalName + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: File type not supported!'));
    }
};

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});

// Single file upload
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Construct URL
        const publicDir = path.join(__dirname, '../public');
        const relativePath = path.relative(publicDir, req.file.path);
        const fileUrl = '/' + relativePath.split(path.sep).join('/');
        const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                originalName: req.file.originalname,
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: fileUrl,
                fullUrl: fullUrl,
                path: req.file.path
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Multiple files upload
router.post('/upload-multiple', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const publicDir = path.join(__dirname, '../public');
        const relativePath = path.relative(publicDir, file.path);
        const fileUrl = '/' + relativePath.split(path.sep).join('/');

        return {
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            url: fileUrl,
            fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
        };

        res.json({
            success: true,
            message: 'Files uploaded successfully',
            data: files,
            count: files.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete file
router.delete('/delete/:filename', (req, res) => {
    try {
        const { filename } = req.params;

        // Find file recursively in uploads directory
        function findFile(dir, targetFile) {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    const found = findFile(filePath, targetFile);
                    if (found) return found;
                } else if (file === targetFile) {
                    return filePath;
                }
            }
            return null;
        }

        const filePath = findFile(uploadDir, filename);

        if (!filePath) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Delete the file
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: 'File deleted successfully',
            data: { filename }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// List all uploaded files (optional)
router.get('/list', (req, res) => {
    try {
        function getAllFiles(dir) {
            let results = [];
            const list = fs.readdirSync(dir);

            list.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    results = results.concat(getAllFiles(filePath));
                } else {
                    results.push({
                        name: file,
                        path: filePath,
                        size: stat.size,
                        modified: stat.mtime,
                        url: `/uploads/${file}`,
                        fullUrl: `${req.protocol}://${req.get('host')}/uploads/${file}`
                    });
                }
            });

            return results;
        }

        const files = getAllFiles(uploadDir);

        res.json({
            success: true,
            data: files,
            count: files.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get file info
router.get('/info/:filename', (req, res) => {
    try {
        const { filename } = req.params;

        function findFile(dir, targetFile) {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    const found = findFile(filePath, targetFile);
                    if (found) return found;
                } else if (file === targetFile) {
                    return filePath;
                }
            }
            return null;
        }

        const filePath = findFile(uploadDir, filename);

        if (!filePath) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const stat = fs.statSync(filePath);

        res.json({
            success: true,
            data: {
                name: filename,
                path: filePath,
                size: stat.size,
                modified: stat.mtime,
                created: stat.ctime,
                url: `/uploads/${filename}`,
                fullUrl: `${req.protocol}://${req.get('host')}/uploads/${filename}`
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
const EWaste = require('../models/EWaste');

// @desc    Create new e-waste post
// @route   POST /api/ewaste
// @access  Private (User only)
const createEWaste = async (req, res) => {
    try {
        const { title, description, category, condition, quantity, price, location } = req.body;

        // Validate required fields
        if (!title || !description || !category || !condition) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Get image URLs from uploaded files
        const images = req.files ? req.files.map(file => file.path) : [];

        // Create e-waste item
        const eWaste = await EWaste.create({
            user: req.user.id,
            title,
            description,
            category,
            condition,
            quantity: quantity || 1,
            price: price || null,
            location,
            images
        });

        res.status(201).json({
            success: true,
            data: eWaste
        });
    } catch (error) {
        console.error('Create e-waste error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all e-waste posts by current user
// @route   GET /api/ewaste/my-posts
// @access  Private
const getMyEWaste = async (req, res) => {
    try {
        const eWastes = await EWaste.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('collectedBy', 'name email');

        res.status(200).json({
            success: true,
            count: eWastes.length,
            data: eWastes
        });
    } catch (error) {
        console.error('Get my e-waste error:', error);
        res.status(500).json({ error: 'Failed to fetch e-waste posts' });
    }
};

// @desc    Get all e-waste posts (for collectors/admin)
// @route   GET /api/ewaste
// @access  Private
const getAllEWaste = async (req, res) => {
    try {
        const { status, condition } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (condition) filter.condition = condition;

        const eWastes = await EWaste.find(filter)
            .sort({ createdAt: -1 })
            .populate('user', 'name email phone address')
            .populate('collectedBy', 'name email');

        res.status(200).json({
            success: true,
            count: eWastes.length,
            data: eWastes
        });
    } catch (error) {
        console.error('Get all e-waste error:', error);
        res.status(500).json({ error: 'Failed to fetch e-waste posts' });
    }
};

// @desc    Get single e-waste post
// @route   GET /api/ewaste/:id
// @access  Private
const getEWasteById = async (req, res) => {
    try {
        const eWaste = await EWaste.findById(req.params.id)
            .populate('user', 'name email phone address')
            .populate('collectedBy', 'name email');

        if (!eWaste) {
            return res.status(404).json({ error: 'E-waste post not found' });
        }

        res.status(200).json({
            success: true,
            data: eWaste
        });
    } catch (error) {
        console.error('Get e-waste by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch e-waste post' });
    }
};

// @desc    Update e-waste post
// @route   PUT /api/ewaste/:id
// @access  Private (Owner only)
const updateEWaste = async (req, res) => {
    try {
        const { title, description, category, condition, quantity, price, location } = req.body;

        let eWaste = await EWaste.findById(req.params.id);

        if (!eWaste) {
            return res.status(404).json({ message: 'E-waste item not found' });
        }

        // Check ownership
        if (eWaste.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }

        // Update fields
        eWaste.title = title || eWaste.title;
        eWaste.description = description || eWaste.description;
        eWaste.category = category || eWaste.category;
        eWaste.condition = condition || eWaste.condition;
        eWaste.quantity = quantity || eWaste.quantity;
        eWaste.price = price !== undefined ? price : eWaste.price;
        eWaste.location = location !== undefined ? location : eWaste.location;

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            eWaste.images = [...eWaste.images, ...newImages];
        }

        await eWaste.save();

        res.json({
            success: true,
            data: eWaste
        });
    } catch (error) {
        console.error('Update e-waste error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete e-waste post
// @route   DELETE /api/ewaste/:id
// @access  Private (Owner only)
const deleteEWaste = async (req, res) => {
    try {
        const eWaste = await EWaste.findById(req.params.id);

        if (!eWaste) {
            return res.status(404).json({ error: 'E-waste post not found' });
        }

        // Check if user is the owner
        if (eWaste.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        await eWaste.deleteOne();

        res.status(200).json({
            success: true,
            message: 'E-waste post deleted successfully'
        });
    } catch (error) {
        console.error('Delete e-waste error:', error);
        res.status(500).json({ error: 'Failed to delete e-waste post' });
    }
};

// @desc    Mark e-waste as collected (for collectors)
// @route   PUT /api/ewaste/:id/collect
// @access  Private (Collector/Admin only)
const markAsCollected = async (req, res) => {
    try {
        const eWaste = await EWaste.findById(req.params.id);

        if (!eWaste) {
            return res.status(404).json({ error: 'E-waste post not found' });
        }

        if (eWaste.status === 'collected') {
            return res.status(400).json({ error: 'E-waste already collected' });
        }

        eWaste.status = 'collected';
        eWaste.collectedBy = req.user.id;
        eWaste.collectedAt = Date.now();

        await eWaste.save();

        res.status(200).json({
            success: true,
            message: 'E-waste marked as collected',
            data: eWaste
        });
    } catch (error) {
        console.error('Mark as collected error:', error);
        res.status(500).json({ error: 'Failed to mark as collected' });
    }
};

module.exports = {
    createEWaste,
    getMyEWaste,
    getAllEWaste,
    getEWasteById,
    updateEWaste,
    deleteEWaste,
    markAsCollected
};

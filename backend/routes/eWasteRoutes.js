const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const upload = require('../config/multer');
const { protect, authorize } = require('../middleware/auth');
const {
    createEWaste,
    getMyEWaste,
    getAllEWaste,
    getEWasteById,
    updateEWaste,
    deleteEWaste,
    markAsCollected
} = require('../controllers/eWasteController');

// Validation rules
const eWasteValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').optional().isIn(['Electronics', 'Appliances', 'Computers', 'Mobile Devices', 'Batteries', 'Other']),
    body('condition').isIn(['working', 'not working', 'damaged']).withMessage('Invalid condition'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Routes
router.post('/', protect, upload.array('images', 5), eWasteValidation, createEWaste);
router.get('/my-posts', protect, getMyEWaste);
router.get('/', protect, getAllEWaste);
router.get('/:id', protect, getEWasteById);
router.put('/:id', protect, upload.array('images', 5), updateEWaste);
router.delete('/:id', protect, deleteEWaste);
router.put('/:id/collect', protect, authorize('collector', 'admin'), markAsCollected);

module.exports = router;

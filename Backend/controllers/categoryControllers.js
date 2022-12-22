const { Category } = require('../models/Category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.createCategory = async (req, res) => {
    try {
        let category = new Category(req.body);
        category = await category.save();
        res.status(201).json({ success: true, category })
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" })
        } else {
            await category.remove();
            res.status(200).json({ success: true, message: "Category deleted successfully" })
        }
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
        } else {
            res.status(200).json({ success: true, category: category });
        }
    } catch (error) {
        res.status(500).json({ success: false, error })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
        } else {
            category.name = req.body.name;
            category.color = req.body.color;
            category.icon = req.body.icon;
            await category.save();
            res.status(200).json({ success: true, message: "Category updated successfully", category: category });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}
const { Product } = require('../models/Product')
const { Category } = require('../models/Category');
const mongoose = require('mongoose');
const errorHandler = require('../utils/errorHandler');

exports.createProduct = async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) { return errorHandler(res, 'Category not Found', 404) }
        if (!req.file) { return errorHandler(res, 'Please Upload Image', 403) }
        req.body.image = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`
        let product = new Product(req.body);
        product = await product.save();
        res.status(201).json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const filter = req.query.categories ? { category: req.query.categories.split(',') } : {}
        const products = await Product.find(filter).populate('category');
        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
        } else {
            await product.populate('category')
            res.status(200).json({ success: true, product: product });
        }
    } catch (error) {
        res.status(500).json({ success: false, error })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
        }
        else {
            const category = await Category.findById(req.body.category);
            if (!category) { res.status(404).json({ success: false, message: "Category not found" }) }
            else {
                product.rating = req.body.rating
                product.description = req.body.description
                product.richDescription = req.body.richDescription
                product.image = req.file ? `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}` : product.image
                product.numReviews = req.body.numReviews
                product.isFeatured = req.body.isFeatured
                product.category = req.body.category
                product.countInStock = req.body.countInStock
                product.rating = req.body.rating
                product.brand = req.body.brand
                product.name = req.body.name
                await product.save();
                res.status(200).json({ success: true, message: "Product updated successfully", product: product });
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" })
        } else {
            await product.remove();
            res.status(200).json({ success: true, message: "Product deleted successfully" })
        }
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.getFeaturedProducts = async (req, res) => {
    try {
        const product_count = await Product.find({ isFeatured: true }).countDocuments();
        const count = +(req.params.count ? req.params.count : product_count)
        const products = await Product.find({ isFeatured: true }).limit(count)
        res.status(200).json({ success: true, products, count: products.length })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error });
    }
}

exports.uploadGallery = async (req, res, next) => {
    try {
        if (!req.files) { return errorHandler(res, 'Please Upload Images', 403) }
        const images = []
        req.files.map(file => {
            images.push(`${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`)
        })
        const product = await Product.findByIdAndUpdate(req.params.id, { images }, { new: true, runValidators: true });
        if (!product) { return errorHandler(res, 'Product not found', 404) }
        res.status(200).json({ success: true, message: "Gallery Uploaded successfully", product })
    } catch (error) {
        console.log(error);
        return errorHandler(res)
    }
}
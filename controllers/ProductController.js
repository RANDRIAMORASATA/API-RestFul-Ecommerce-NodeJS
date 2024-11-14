const ProductModel = require('../models/ProductModel.js');
const fs = require('fs');

module.exports = {
    list: async (req, res) => {
        try {
            const products = await ProductModel.find();
            return res.status(200).json({
                status: 200,
                products: products
            });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error when getting products',
                error: err.message
            });
        }
    },

    show: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await ProductModel.findOne({ _id: id });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'No such Product'
                });
            }
            return res.status(200).json({
                status: 200,
                product: product
            });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error when getting product',
                error: err.message
            });
        }
    },

    create: async (req, res) => {
        console.log(req.body);
        console.log(req.file);
    
        if (!req.file) {
            return res.status(500).json({
                status: 500,
                message: 'Product image required',
            });
        }
    
        try {
            const productData = JSON.parse(req.body.product);
            delete productData._id; // Supprimer _id pour éviter les conflits
    
            const product = new ProductModel({
                ...productData,
                image: `${req.protocol}://${req.get('host')}/images/products/${req.file.filename}`
            });
    
            const savedProduct = await product.save();
    
            return res.status(201).json({
                status: 201,
                message: 'Product created',
                product: savedProduct
            });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error when creating product',
                error: err.message
            });
        }
    },
    
    

    update: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await ProductModel.findOne({ _id: id });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'No such Product'
                });
            }

            product.name = req.body.name || product.name;
            product.description = req.body.description || product.description;
            product.price = req.body.price || product.price;
            product.stock = req.body.stock || product.stock;
            product.userId = req.body.userId || product.userId;
            product.createdAt = req.body.createdAt || product.createdAt;

            if (req.file && product.image) {
                const oldImageName = product.image.split('/products/')[1];
                product.image = `${req.protocol}://${req.get('host')}/images/products/${req.file.filename}`;
                fs.unlink(`public/images/products/${oldImageName}`, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                });
            }

            const savedProduct = await product.save();

            return res.status(201).json({
                status: 201,
                message: 'Product updated!',
                product: savedProduct
            });

        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error when updating product',
                error: err.message
            });
        }
    },

    delete: async (req, res) => {
        const id = req.params.id;

        try {
            const deletedProduct = await ProductModel.findOneAndDelete({ _id: id });
            if (!deletedProduct) {
                return res.status(404).json({
                    status: 404,
                    message: 'No such Product'
                });
            }

            const imageName = deletedProduct.image.split('/products/')[1];
            fs.unlink(`public/images/products/${imageName}`, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });

            return res.status(201).json({
                status: 201,
                message: 'Product deleted',
                product: deletedProduct
            });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error when deleting product',
                error: err.message
            });
        }
    }
};

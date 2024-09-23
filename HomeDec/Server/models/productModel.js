const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    variants: [
        {
            color: {
                type: String,
                required: true
            },
            colorHex: {
                type: String,
                required: true
            },
            stock: {
                type: Number,
                required: true,
                min: 0
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            images: {
                type: Array, 
                // validate: [images => images.length >= 3, 'Must have at least 3 images']
            }
        }
    ],
    itemProperties: [
        {
            field: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ],
    deliveryCondition: {
        type: String,
        required: true
    },
    warranty: {
        type: String,
        required: true
    },
    relatedKeywords: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

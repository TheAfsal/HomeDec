const mongoose = require('mongoose');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6, 
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('Admin', adminSchema, 'admin');

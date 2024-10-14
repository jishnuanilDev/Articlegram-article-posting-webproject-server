const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date, 
        required: true
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article'
    }],
    articlePreferences: [String] 
});

const User = mongoose.model('User', userSchema);

module.exports = User;

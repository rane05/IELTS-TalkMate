const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    targetBand: { type: Number, default: 7.0 },
    englishLevel: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], default: 'INTERMEDIATE' },
    routine: [{
        day: String,
        tasks: [String]
    }],
    examDate: String,
    joinedAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

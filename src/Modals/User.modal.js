const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        select: false
    },
    profilePicture: {
        type: String,
        required: false
    },
    streak: [
        {
            points: { type: Number, default: 0 },
            date: { type: Date, default: Date.now }
        }
    ],
    gems: {
        type: Number,
        default: 0
    },
    tracks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "TrackModal",
        default: []
    },
    dailyReward: {
        type: String,
        default: null
    },
    WhatsAppNumber: {
        type: String,
        sparse: true,   // allows multiple nulls
        unique: true,     // works only when value exists
        default: ""
    }
}, { timestamps: true });

const UserModal = mongoose.model('UserModal', userSchema);

module.exports = UserModal;
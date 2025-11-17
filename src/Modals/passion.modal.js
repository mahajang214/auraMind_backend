const mongoose = require('mongoose');

const passionSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModal', required: true },
    passions: [
        {
            name: { type: String, required: true },
            frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], required: true },
            description: { type: String },
        }],
}, { timestamps: true });

const passionsModal = mongoose.model('PassionsModal', passionSchema);
module.exports = passionsModal;
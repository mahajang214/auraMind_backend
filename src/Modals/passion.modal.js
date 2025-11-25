const mongoose = require('mongoose');

const defaultPassions = [
    { name: "DemoPassion", frequency: "Daily", description: "This is a demo passion you can delete it after creating new passions" },
];
const passionSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModal', required: true },
    passions: [
        {
            name: { type: String, required: true },
            frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], required: true },
            description: { type: String },
        }
    ],
}, { timestamps: true });

// // ⭐ Add defaults ONLY if empty
// passionSchema.pre("save", function (next) {
//     if (!this.passions || this.passions.length === 0) {
//         this.passions = defaultPassions;
//     }
//     next();
// });

const passionsModal = mongoose.model('PassionsModal', passionSchema);
module.exports = passionsModal;
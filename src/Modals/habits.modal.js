const mongoose = require('mongoose');

const defaultHabits = [
    { name: "DemoHabit", frequency: "Daily", description: "This is a demo habit you can delete it after creating new habits" },
    
];

const habitSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModal', required: true },
    habits: [
        {
            name: { type: String, required: true },
            frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], required: true },
            description: { type: String },

        }],
}, { timestamps: true });

// ⭐ Add defaults ONLY if empty
// habitSchema.pre("save", function (next) {
//     if (!this.habits || this.habits.length === 0) {
//         this.habits = defaultHabits;
//     }
//     next();
// });

const HabitsModal = mongoose.model('HabitsModal', habitSchema);
module.exports = HabitsModal;
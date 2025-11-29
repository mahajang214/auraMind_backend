const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModal', required: true },
  habits: [
    {
      name: { type: String, required: true },
      frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        required: true
      },
      description: { type: String, default: '' },
    }
  ],
}, { timestamps: true });

const HabitsModal = mongoose.model('HabitsModal', habitSchema);
module.exports = HabitsModal;

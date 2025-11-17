const mongoose = require('mongoose');

const MonthlyReportSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModal',
    required: true,
  },
  totalTasks: {
    type: Number,
    default: 0,
  },
  completedTasks: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0, // e.g., 75 means 75% completed
  },
  month: {
    type: Number,
    required: true, // 1–12
  },
  year: {
    type: Number,
    required: true,
  },
  monthName: {
    type: String,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MonthlyReportModel = mongoose.model('MonthlyReport', MonthlyReportSchema);
module.exports = MonthlyReportModel;

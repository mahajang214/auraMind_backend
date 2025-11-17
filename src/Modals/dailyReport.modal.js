const mongoose = require('mongoose');

const DailyReportSchema = new mongoose.Schema({
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
    default: 0,
  },
  date: {
    type: Date,
    required: true, // store actual date like "2025-11-02"
  },
  dayName: {
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  weekNumber: {
    type: Number,
  },
  month: {
    type: Number,
  },
  year: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DailyReportModel = mongoose.model('DailyReport', DailyReportSchema);
module.exports = DailyReportModel;

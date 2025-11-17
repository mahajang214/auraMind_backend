const mongoose = require('mongoose');

const YearlyReportSchema = new mongoose.Schema({
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
    default: 0, // average completion % for the year
  },
  year: {
    type: Number,
    required: true,
  },
  totalMonthsTracked: {
    type: Number,
    default: 0, // how many months have data this year
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const YearlyReportModel = mongoose.model('YearlyReport', YearlyReportSchema);
module.exports = YearlyReportModel;

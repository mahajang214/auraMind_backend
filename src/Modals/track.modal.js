const mongoose = require("mongoose");
const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
    },
    category: {
      type: String,
      enum: ["Health", "Work", "Learning", "Productivity", "Social", "Financial", "Entertainment", "Other"],
      default: "Other",
    },
    duration: {
      type: {
        hr: { type: Number, default: 0 },
        min: { type: Number, default: 0 },
        sec: { type: Number, default: 0 },
      },
      default: { hr: 0, min: 0, sec: 0 },
    },
    old_durations: {
      type: [
        {
          hr: { type: Number, default: 0 },
          min: { type: Number, default: 0 },
          sec: { type: Number, default: 0 },
          updatedAt: { type: Date, default: Date.now }
        }
      ],
      default: [{ hr: 0, min: 0, sec: 0, updatedAt: Date.now() }],
      validate: [arr => arr.length <= 2, '{PATH} exceeds the limit of 2']
    },
    max_duration: {
      type: {
        hr: { type: Number, default: 0 },
        min: { type: Number, default: 30 },
        sec: { type: Number, default: 0 },
      },
      default: { hr: 0, min: 30, sec: 0 },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModal",
      required: true,
    },
    answersCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TrackModal = mongoose.model("Track", trackSchema);
module.exports = TrackModal;

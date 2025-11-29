const mongoose = require("mongoose");

const goalSubSchema = new mongoose.Schema(
  {
    goal: { type: String, required: true, trim: true, default: "" },
  },
  { _id: false }
);

const fiveTwentyFiveSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModal",
      required: true,
    },

    fiveGoals: {
      type: [goalSubSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "fiveGoals cannot contain more than 5 items",
      },
    },

    twentyGoals: {
      type: [goalSubSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "twentyGoals cannot contain more than 20 items",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FiveTwentyFiveModal", fiveTwentyFiveSchema);

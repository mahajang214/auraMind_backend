const mongoose = require("mongoose");

const ikigaiSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModal", required: true },

  data: {
    passion: { type: [String], default: [] },
    mission: { type: [String], default: [] },
    vocation: { type: [String], default: [] },
    profession: { type: [String], default: [] },
  },

  whatYouLove: { type: String, default: "" },
  whatTheWorldNeeds: { type: String, default: "" },
  whatYouAreGoodAt: { type: String, default: "" },
  whatYouCanBePayedFor: { type: String, default: "" },

}, { timestamps: true });


const IkigaiModal = mongoose.model("IkigaiModal", ikigaiSchema);
module.exports = IkigaiModal;
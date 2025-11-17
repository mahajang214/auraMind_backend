const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModal", required: true },
  data:[
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      answeredAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

const QuestionModal = mongoose.model("QuestionModal", questionSchema);
module.exports = QuestionModal;
  
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    default: "i_1_1",
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  }
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
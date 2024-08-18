const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waChatSchema = new Schema({
}, { timestamps: true });

const WaChat = mongoose.model("WaChat", waChatSchema);
module.exports = WaChat;
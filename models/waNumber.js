const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waNumberSchema = new Schema({
    number: {
        type: String,
        required: true,
    },
    waLinkId: {
        type: Schema.Types.ObjectId,
        ref: 'WaLink',
        required: true,
    },
    access: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

const WaNumber = mongoose.model("WaNumber", waNumberSchema);
module.exports = WaNumber;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waLinkSchema = new Schema({
    accessToken: {
        type: String,
        required: true,
    },
    businessId: {
        type: String,
        required: true,
    },
    isAccessActive: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const WaLink = mongoose.model("WaLink", waLinkSchema);
module.exports = WaLink;
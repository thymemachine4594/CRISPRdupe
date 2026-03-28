const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    disease_name: {
        type: String,
        required: true,
        enum: ["Sickle Cell Anemia", "Beta Thalassemia", "ATTR", "LCA"]
    },
    importance_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    recommendation: {
        type: String,
        required: true,
        enum: ["Recommended", "Not Recommended"]
    },
    threshold_used: {
        type: Number,
        required: true,
        default: 55
    },
    sources_used: [{
        source: String,
        source_type: String,
        doi: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Result", resultSchema);

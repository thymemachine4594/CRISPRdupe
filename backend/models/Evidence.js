const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema({
    disease_name: {
        type: String,
        required: true,
        enum: ["Sickle Cell Anemia", "Beta Thalassemia", "ATTR", "LCA"]
    },
    source: {
        type: String,
        required: true
    },
    source_type: {
        type: String,
        required: true,
        enum: [
            "WHO",
            "NIH",
            "CDC",
            "NATURE",
            "SCIENCE",
            "LANCET",
            "PUBMED_INDEXED",
            "UNIVERSITY",
            "CLINICAL_REPORT",
            "PREPRINT",
            "OTHER"
        ]
    },
    number_of_clinical_evidences: {
        type: Number,
        required: true,
        default: 0
    },
    citation_count: {
        type: Number,
        required: true,
        default: 0
    },
    evidence_level: {
        type: String,
        required: true,
        enum: [
            "in_vitro",
            "animal_model",
            "clinical_phase_1",
            "clinical_phase_2",
            "clinical_phase_3",
            "approved"
        ]
    },
    doi: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null/missing values if it's optional
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Evidence", evidenceSchema);

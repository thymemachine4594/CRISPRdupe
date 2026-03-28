const express = require("express");
const router = express.Router();
const Evidence = require("../models/Evidence");

const SOURCE_SCORES = {
    "WHO": 10,
    "NIH": 9,
    "CDC": 9,
    "NATURE": 9,
    "SCIENCE": 9,
    "LANCET": 9,
    "PUBMED_INDEXED": 8,
    "UNIVERSITY": 7,
    "CLINICAL_REPORT": 6,
    "PREPRINT": 5,
    "OTHER": 4
};

const EVIDENCE_SCORES = {
    "in_vitro": 2,
    "animal_model": 4,
    "clinical_phase_1": 6,
    "clinical_phase_2": 7,
    "clinical_phase_3": 9,
    "approved": 10
};

router.get("/relevance/:disease", async (req, res) => {
    try {
        const { disease } = req.params;
        const records = await Evidence.find({ disease_name: disease });

        if (records.length === 0) {
            return res.status(404).json({ message: "No evidence found for this disease" });
        }

        const calculatedRecords = records.map(record => {
            const source_score = SOURCE_SCORES[record.source_type] || 0;
            const evidence_score = EVIDENCE_SCORES[record.evidence_level] || 0;

            const clinical_score = Math.min(10, record.number_of_clinical_evidences);
            const citation_score = Math.min(10, Math.log10(record.citation_count + 1) * 2);

            const importance_score =
                (source_score * 10 * 0.10) +
                (clinical_score * 10 * 0.30) +
                (citation_score * 10 * 0.20) +
                (evidence_score * 10 * 0.40);

            return {
                ...record.toObject(),
                importance_score: Math.round(importance_score * 10) / 10 // round to 1 decimal
            };
        });

        // Sort by importance_score descending to find the highest ranking record
        calculatedRecords.sort((a, b) => b.importance_score - a.importance_score);

        const highestRankingRecord = calculatedRecords[0];

        res.json({
            highestScore: highestRankingRecord.importance_score,
            allSources: calculatedRecords,
            highestRankingRecord: highestRankingRecord
        });

    } catch (error) {
        console.error("Error calculating CRISPR relevance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;

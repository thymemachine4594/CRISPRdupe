/* backend/seed.js */
const mongoose = require("mongoose");
require("dotenv").config();
const Evidence = require("./models/Evidence");
const Result = require("./models/Result");

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await Evidence.deleteMany({});
        await Result.deleteMany({});

        // Sample Evidence Data
        const sampleEvidence = [
            {
                disease_name: "Sickle Cell Anemia",
                source: "Nature Medicine",
                source_type: "NATURE",
                number_of_clinical_evidences: 8,
                citation_count: 450,
                evidence_level: "clinical_phase_3",
                doi: "10.1038/s41591-023-0123-x"
            },
            {
                disease_name: "Beta Thalassemia",
                source: "New England Journal of Medicine",
                source_type: "LANCET", // Using high-tier equivalent
                number_of_clinical_evidences: 12,
                citation_count: 890,
                evidence_level: "approved",
                doi: "10.1056/NEJMoa2031054"
            },
            {
                disease_name: "ATTR",
                source: "NIH Research database",
                source_type: "NIH",
                number_of_clinical_evidences: 4,
                citation_count: 120,
                evidence_level: "clinical_phase_2",
                doi: "10.1172/JCI145678"
            },
            {
                disease_name: "LCA",
                source: "Science Translational Medicine",
                source_type: "SCIENCE",
                number_of_clinical_evidences: 2,
                citation_count: 85,
                evidence_level: "clinical_phase_1",
                doi: "10.1126/scitranslmed.abc1234"
            }
        ];

        // Sample Result Data (Calculated examples)
        const sampleResults = [
            {
                disease_name: "Sickle Cell Anemia",
                importance_score: 85.5,
                recommendation: "Recommended",
                threshold_used: 55,
                sources_used: [
                    { source: "Nature Medicine", source_type: "NATURE", doi: "10.1038/s41591-023-0123-x" }
                ]
            },
            {
                disease_name: "Beta Thalassemia",
                importance_score: 92.0,
                recommendation: "Recommended",
                threshold_used: 55,
                sources_used: [
                    { source: "NEJM", source_type: "LANCET", doi: "10.1056/NEJMoa2031054" }
                ]
            },
            {
                disease_name: "ATTR",
                importance_score: 65.0,
                recommendation: "Not Recommended",
                threshold_used: 55,
                sources_used: [
                    { source: "NIH Research", source_type: "NIH", doi: "10.1172/JCI145678" }
                ]
            }
        ];

        await Evidence.insertMany(sampleEvidence);
        await Result.insertMany(sampleResults);

        console.log("Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData();

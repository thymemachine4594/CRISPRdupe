/**
 * Disease Scoring Engine — Weighted + Penalty System
 *
 * Each disease maps questions to WEIGHTS that reflect clinical specificity:
 *   • High weight  → symptom is strongly indicative of THIS disease
 *   • Low weight   → symptom is shared / non-specific
 *
 * Cross-disease penalties ensure diseases cannot all score 100% simultaneously:
 *   • BT is penalised when SCA-specific markers (q7, q13, q14, q16, q17) are Yes
 *   • LCA score is reduced gradually for every blood-disorder symptom present
 *   • ATTR is zeroed if ANY blood-disorder marker is Yes (binary gate)
 *
 * Score % = clamp((weighted_yes − penalty) / disease_max, 0, 1) × 100
 * Threshold: 35% — highest disease above threshold wins.
 */

// ─── Question weights per disease ──────────────────────────────────────────
// Higher = more specific to that disease
const WEIGHTS = {
    sickleCell: {
        q1: 1,  // bone/joint pain          — shared
        q2: 1,  // fatigue                  — shared
        q3: 2,  // jaundice                 — haemolysis, somewhat shared
        q4: 1,  // shortness of breath      — shared
        q7: 5,  // pain crises/triggers     — HIGHLY specific to SCA
        q8: 2,  // low haemoglobin          — shared but common in SCA
        q9: 2,  // frequent infections      — common in SCA (splenic sequestration)
        q10: 1,  // abdominal fullness       — shared
        q11: 1,  // blood transfusions       — less specific for SCA
        q12: 1,  // enlarged spleen          — shared
        q13: 5,  // chest pain + fever       — HIGHLY specific (acute chest syndrome)
        q14: 5,  // leg ulcers               — HIGHLY specific to SCA
        q15: 1,  // delayed growth           — shared
        q16: 4,  // hospital admissions      — specific to SCA pain crises
        q17: 4,  // dark urine               — specific (haemoglobinuria)
        q18: 1,  // family blood disorder    — shared
    },
    // SCA_MAX = 1+1+2+1+5+2+2+1+1+1+5+5+1+4+4+1 = 37

    betaThal: {
        q1: 1,  // shared
        q2: 1,  // shared
        q3: 2,  // jaundice — haemolysis
        q4: 1,  // shared
        q8: 3,  // anaemia — very common in Beta Thal
        q9: 2,  // infections — immune issues
        q10: 2,  // abdominal fullness (splenomegaly prominent in BT)
        q11: 4,  // blood transfusions — very specific to BT
        q12: 3,  // enlarged spleen — prominent in BT
        q15: 4,  // delayed growth/puberty — very specific to BT
        q18: 2,  // family history — important for inherited BT
    },
    // BT_MAX = 1+1+2+1+3+2+2+4+3+4+2 = 25

    attr: {
        q1: 1,  // pain — shared
        q2: 2,  // fatigue — more specific in ATTR
        q4: 2,  // shortness of breath — cardiac amyloid involvement
        q5: 6,  // numbness/tingling — DEFINING symptom of ATTR neuropathy
        q18: 2,  // family history — hereditary ATTR
    },
    // ATTR_MAX = 1+2+2+6+2 = 13

    lca: {
        q6: 7,  // poor vision since infancy — defining characteristic of LCA
        q18: 2,  // family history — LCA is hereditary
    },
    // LCA_MAX = 7+2 = 9
}

const DISEASE_MAX = { sickleCell: 37, betaThal: 25, attr: 13, lca: 9 }

// SCA-specific markers that REDUCE the Beta Thal score
// (if a patient has these, the picture is SCA, not BT)
const BT_PENALTIES = { q7: 5, q13: 5, q14: 5, q16: 3, q17: 3 }
// Max BT penalty = 21 → floors BT to ~16% even on all-Yes

// Blood-disorder markers that each subtract 1 raw point from the LCA score
// (LCA is a retinal disease — blood disorder symptoms make it very unlikely)
const LCA_DISORDER_MARKERS = [
    "q3", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16", "q17",
]

// If ANY of these are Yes, ATTR is completely ruled out
const ATTR_BLOOD_MARKERS = [
    "q3", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16", "q17",
]

const DISEASE_NAMES = {
    sickleCell: "Sickle Cell Anemia",
    betaThal: "Beta Thalassemia",
    attr: "ATTR",
    lca: "LCA",
}

// Minimum % a disease must beat to become "the" diagnosis
const THRESHOLD = 35

const isYes = (answers, q) => answers[q] === "Yes"
const weightedSum = (answers, weights) =>
    Object.entries(weights).reduce((sum, [q, w]) => sum + (isYes(answers, q) ? w : 0), 0)

/**
 * @param {Object} answers  e.g. { q1: "Yes", q2: "No", ... }
 * @returns {{ topDisease: string|null, percentages: Object }}
 */
export function computeDiagnosis(answers) {
    // ── Sickle Cell ────────────────────────────────────────────────────────────
    const scaRaw = weightedSum(answers, WEIGHTS.sickleCell)
    const scaPct = Math.round((scaRaw / DISEASE_MAX.sickleCell) * 100)

    // ── Beta Thalassemia (penalised by SCA-specific markers) ───────────────────
    const btRaw = weightedSum(answers, WEIGHTS.betaThal)
    const btPenalty = Object.entries(BT_PENALTIES).reduce(
        (sum, [q, pen]) => sum + (isYes(answers, q) ? pen : 0), 0
    )
    const btScore = Math.max(0, btRaw - btPenalty)
    const btPct = Math.round((btScore / DISEASE_MAX.betaThal) * 100)

    // ── ATTR (binary blood-disorder gate) ──────────────────────────────────────
    const attrGated = ATTR_BLOOD_MARKERS.some(q => isYes(answers, q))
    const attrRaw = attrGated ? 0 : weightedSum(answers, WEIGHTS.attr)
    const attrPct = attrGated ? 0 : Math.round((attrRaw / DISEASE_MAX.attr) * 100)

    // ── LCA (q6 required; graduated penalty for blood-disorder symptoms) ────────
    let lcaPct = 0
    if (isYes(answers, "q6")) {
        const lcaRaw = weightedSum(answers, WEIGHTS.lca)
        const lcaPenalty = LCA_DISORDER_MARKERS.filter(q => isYes(answers, q)).length
        const lcaScore = Math.max(0, lcaRaw - lcaPenalty)
        lcaPct = Math.round((lcaScore / DISEASE_MAX.lca) * 100)
    }

    // ── Pick winner above threshold ────────────────────────────────────────────
    const scores = { sickleCell: scaPct, betaThal: btPct, attr: attrPct, lca: lcaPct }

    let topDisease = null
    let topPct = THRESHOLD
    let mostLikelyDisease = null
    let mostLikelyPercentage = -1

    for (const [disease, pct] of Object.entries(scores)) {
        if (pct > mostLikelyPercentage) {
            mostLikelyPercentage = pct
            mostLikelyDisease = DISEASE_NAMES[disease]
        }

        if (pct > topPct) {
            topPct = pct
            topDisease = DISEASE_NAMES[disease]
        }
    }

    if (mostLikelyPercentage <= 0) {
        mostLikelyDisease = null
    }

    return {
        topDisease,
        mostLikelyDisease,
        mostLikelyPercentage,
        percentages: {
            "Sickle Cell Anemia": scaPct,
            "Beta Thalassemia": btPct,
            "ATTR": attrPct,
            "LCA": lcaPct,
        },
    }
}

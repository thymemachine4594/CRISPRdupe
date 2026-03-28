import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CircularResult, CrisprRecommendation } from "../components/CircularResult"
import DNAHelix from "../components/DNAHelix"
import { useDiagnosis } from "../context/DiagnosisContext"

// Chart colours for each disease
const DISEASE_COLOURS = {
  "Sickle Cell Anemia": "#ef4444",
  "Beta Thalassemia": "#3b82f6",
  "ATTR": "#f59e0b",
  "LCA": "#a78bfa",
}

export default function Result() {
  const navigate = useNavigate()
  const { diagnosisResult } = useDiagnosis()

  const [crisprData, setCrisprData] = useState(null)
  const [loading, setLoading] = useState(false)

  const threshold = 55

  // Guard: if user navigated here directly without completing the questionnaire
  if (!diagnosisResult) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <p style={{ color: "#fff", fontSize: "20px" }}>No assessment data found.</p>
        <button className="glow-btn" onClick={() => navigate("/diagnosis/1")}>
          Start Assessment
        </button>
      </div>
    )
  }

  const { topDisease, percentages } = diagnosisResult

  useEffect(() => {
    if (!topDisease) return

    setLoading(true)

    fetch(`http://localhost:5000/api/crispr/relevance/${encodeURIComponent(topDisease)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch CRISPR data")
        }
        return res.json()
      })
      .then((data) => {
        setCrisprData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Score fetch failed:", err)
        setCrisprData(null)
        setLoading(false)
      })
  }, [topDisease])

  // Build array for CircularResult chart (all four diseases with live percentages)
  const chartData = Object.entries(percentages || {}).map(([name, value]) => ({
    name,
    value,
    color: DISEASE_COLOURS[name] ?? "#6b7280",
  }))

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "190%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "30px",
      }}
    >
      {/* DNA background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.55,
          pointerEvents: "none",
        }}
      >
        <DNAHelix />
      </div>

      {/* Result card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1050px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            color: "#fff",
            textAlign: "center",
            marginBottom: "12px",
            fontSize: "28px",
          }}
        >
          Genetic Diagnosis &amp; CRISPR Recommendation
        </h2>

        {/* Suspicion label */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          {topDisease ? (
            <p
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: DISEASE_COLOURS[topDisease] ?? "#fff",
                background: "rgba(255,255,255,0.06)",
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: "12px",
                border: `1px solid ${DISEASE_COLOURS[topDisease] ?? "#fff"}44`,
              }}
            >
              In suspicion of{" "}
              <span style={{ textDecoration: "underline" }}>{topDisease}</span>
            </p>
          ) : (
            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#94a3b8",
                background: "rgba(255,255,255,0.06)",
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: "12px",
                border: "1px solid rgba(148,163,184,0.3)",
              }}
            >
              We recommend seeing a doctor
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: "900px",
            margin: "0 auto",
            gap: "30px",
            alignItems: "stretch",
          }}
        >
          {/* LEFT — disease probability chart */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "24px",
              borderRadius: "20px",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: "16px" }}>
              Symptom Match Scores
            </h3>
            <CircularResult data={chartData} />
          </div>

          {/* RIGHT — CRISPR recommendation */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "24px",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              minHeight: "450px",
            }}
          >
            <div style={{ alignSelf: "center", marginBottom: "10px" }}>
              <CrisprRecommendation
                percentage={crisprData?.highestScore || 0}
                threshold={threshold}
              />
            </div>

            <div
              style={{
                flex: 1,
                background: "rgba(0,0,0,0.3)",
                padding: "20px",
                borderRadius: "16px",
                maxHeight: "260px",
                overflowY: "auto",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h4
                  style={{
                    color: "#22c55e",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    margin: 0,
                  }}
                >
                  Evidence Database
                </h4>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  {crisprData?.allSources?.length || 0} RECORDS FOUND
                </span>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                  <p style={{ fontSize: "13px" }}>Loading CRISPR database...</p>
                </div>
              ) : !crisprData ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
                  <p style={{ fontSize: "13px" }}>Awaiting Connection to Database...</p>
                  <p style={{ fontSize: "11px", marginTop: "8px" }}>
                    Please ensure local server (port 5000) is running.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {crisprData?.allSources?.map((record, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.03)",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "6px",
                        }}
                      >
                        <span style={{ color: "#fff", fontWeight: "600", maxWidth: "80%" }}>
                          {record.source}
                        </span>
                        <span
                          style={{
                            color: "#22c55e",
                            fontWeight: "800",
                            background: "rgba(34,197,94,0.1)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "11px",
                          }}
                        >
                          {record.importance_score}%
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#94a3b8",
                          fontSize: "11px",
                        }}
                      >
                        <span>{record.source_type}</span>
                        <span style={{ opacity: 0.6 }}>
                          {record.doi ? `DOI: ${record.doi.substring(0, 15)}...` : "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Restart button */}
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <button className="glow-btn" onClick={() => navigate("/diagnosis/1")}>
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
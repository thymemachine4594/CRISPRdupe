import { useState } from "react"
import { CircularResult, CrisprRecommendation } from "../components/CircularResult"
import DNAHelix from "../components/DNAHelix"

export default function Result() {
  const [resultData] = useState({
    diseases: [
      { name: "Sickle Cell Disease", value: 45, color: "#ef4444" },
      { name: "Beta Thalassemia", value: 30, color: "#3b82f6" },
      { name: "Cystic Fibrosis", value: 25, color: "#f59e0b" },
    ],
    crisprRecommendation: 78,
  })

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "200%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        
        padding: "30px",
      }}
    >
      {/* DNA background - absolute so it doesn't affect layout */}
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

      {/* Centered result card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1100px",
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
            marginBottom: "30px",
            fontSize: "28px",
          }}
        >
          Genetic Diagnosis & CRISPR Recommendation
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: "900px",
            margin: "0 auto",
            gap: "30px",
            alignItems: "center",
          }}
        >
          {/* LEFT SIDE */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "24px",
              borderRadius: "20px",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: "16px" }}>
              Possible Diseases
            </h3>
            <CircularResult data={resultData.diseases} />
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "24px",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CrisprRecommendation percentage={resultData.crisprRecommendation} />
          </div>
        </div>
      </div>
    </div>
  )
}
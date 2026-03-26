import { useEffect, useState } from "react"

export function CircularResult({ data }) {
  const [animatedData, setAnimatedData] = useState(
    data.map((d) => ({ ...d, value: 0 }))
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedData(data)
    }, 300)
    return () => clearTimeout(timeout)
  }, [data])

  const radius = 70
  const circumference = 2 * Math.PI * radius
  let cumulative = 0

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240">
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="transparent"
          stroke="#1f2937"
          strokeWidth="36"
        />

        <g transform="rotate(-90 120 120)">
          {animatedData.map((item, index) => {
            const dash = (item.value / 100) * circumference
            const gap = circumference - dash
            const offset = cumulative
            cumulative += dash

            return (
              <g key={index}>
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="52"
                  strokeOpacity="0.18"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-offset}
                />
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="36"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 10px ${item.color})`,
                    transition: "all 1.2s ease",
                  }}
                />
              </g>
            )
          })}
        </g>

        <text
          x="120"
          y="112"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="18"
          fontWeight="700"
          transform="rotate( 90 120 120)"
        >
          Diseases
        </text>
        <text
          x="120"
          y="136"
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="12"
          transform="rotate( 90 120 120)"
        >
          Possible %
        </text>
      </svg>

      <div style={{ marginTop: "16px", width: "100%" }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              color: "#fff",
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  display: "inline-block",
                }}
              />
              <span>{item.name}</span>
            </div>
            <span>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CrisprRecommendation({ percentage, threshold = 70, loading = false }) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(percentage)
    }, 300)
    return () => clearTimeout(timeout)
  }, [percentage])

  const radius = 55
  const circumference = 2 * Math.PI * radius
  const dash = (animatedValue / 100) * circumference
  const gap = circumference - dash

  const isRecommended = percentage >= threshold
  const statusColor = isRecommended ? "#22c55e" : "#ef4444" // Green if >= 70, Red if < 70

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "220px", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Calculating CRISPR relevance...</p>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="transparent"
          stroke="#1f2937"
          strokeWidth="22"
        />

        <g transform="rotate(-90 90 90)">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={statusColor}
            strokeWidth="22"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 12px ${statusColor})`,
              transition: "all 1.2s ease",
            }}
          />
        </g>

        <text
          x="90"
          y="95"
          textAnchor="middle"
          fill={statusColor}
          fontSize="36"
          fontWeight="800"
          style={{ transition: "all 0.5s ease" }}
        >
          {Math.round(animatedValue)}%
        </text>
        <text
          x="90"
          y="120"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
          fontWeight="600"
          style={{ textTransform: "uppercase", letterSpacing: "1px" }}
        >
          RELEVANCE
        </text>
      </svg>

      <div
        style={{
          marginTop: "16px",
          padding: "8px 20px",
          borderRadius: "30px",
          backgroundColor: `${statusColor}15`,
          border: `1px solid ${statusColor}33`,
          color: statusColor,
          fontSize: "14px",
          fontWeight: "700",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: statusColor,
          boxShadow: `0 0 8px ${statusColor}`
        }} />
        {isRecommended ? "CRISPR Recommended" : "CRISPR Not Recommended"}
      </div>
      <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "4px" }}>
        Suitability Threshold: {threshold}%
      </p>
    </div>
  )
}

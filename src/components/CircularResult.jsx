export default function CircularResult({ value, label }) {
  return (
    <div className="circle">
      <svg>
        <circle cx="60" cy="60" r="54" />
        <circle
          cx="60"
          cy="60"
          r="54"
          style={{
            strokeDashoffset: 339 - (339 * value) / 100,
          }}
        />
      </svg>
      <div className="circle-text">
        {value}%<br />{label}
      </div>
    </div>
  )
}
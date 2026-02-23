import { useNavigate } from "react-router-dom"

export default function DiagnosisStep2() {
  const navigate = useNavigate()

  return (
    <div className="page-center">
      <h2>Basic Symptoms2</h2>

      <button
        className="glow-btn"
        onClick={() => navigate("/diagnosis/3")}
      >
        Next
      </button>
    </div>
  )
}
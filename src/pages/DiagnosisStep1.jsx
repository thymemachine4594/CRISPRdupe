
import { useNavigate } from "react-router-dom"

export default function DiagnosisStep1() {
  const navigate = useNavigate()

  return (
    <div className="page-center">
      <h2>Basic Symptoms1</h2>

      <button
        className="glow-btn"
        onClick={() => navigate("/diagnosis/2")}
      >
        Next
      </button>
    </div>
  )
}
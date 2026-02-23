import { useNavigate } from "react-router-dom"

export default function DiagnosisStep3() {
  const navigate = useNavigate()

  return (
    <div className="page-center">
      <h2>Basic Symptoms3</h2>

      <button
        className="glow-btn"
        onClick={() => navigate("/result")}
      >
        Next
      </button>
    </div>
  )
}
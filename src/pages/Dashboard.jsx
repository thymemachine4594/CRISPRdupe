import { useAuth } from "../context/authcontext"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page-center">
      <h1>Hey {user?.name} 👋</h1>

      <p>
        CRISPR is a revolutionary gene editing technology enabling
        precise DNA modification to treat genetic diseases.
      </p>

      <button
        className="glow-btn"
        onClick={() => navigate("/diagnosis/1")}
      >
        Start Diagnosis
      </button>
    </div>
  )
}
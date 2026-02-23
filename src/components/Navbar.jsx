import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authcontext"

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="navbar">
      <div className="logo">CRISPR PORTAL</div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="username">Hi {user.name}</span>
            <button
              className="glow-btn"
              onClick={() => {
                logout()
                navigate("/")
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            className="glow-btn"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  )
}
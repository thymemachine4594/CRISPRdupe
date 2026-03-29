import { useState } from "react"
import { useAuth } from "../context/authcontext"
import { useNavigate } from "react-router-dom"

export default function Auth() {
  const [isNew, setIsNew] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const url = isNew
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login"

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error)
        return
      }

      login(data.user || { name, email })
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="glow-orb glow-1"></div>
        <div className="glow-orb glow-2"></div>

        <h2 className="auth-title">{isNew ? "Create Account" : "Welcome Back"}</h2>
        <p className="auth-subtitle">
          {isNew ? "Join the future of productivity" : "Sign in to continue"}
        </p>

        <div className="auth-toggle">
          <button
            type="button"
            className={!isNew ? "active" : ""}
            onClick={() => setIsNew(false)}
          >
            Login
          </button>
          <button
            type="button"
            className={isNew ? "active" : ""}
            onClick={() => setIsNew(true)}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isNew && (
            <div className="input-group">
              <span className="input-icon" aria-hidden="true">User</span>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input-group">
            <span className="input-icon" aria-hidden="true">Email</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon" aria-hidden="true">Pass</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="glow-btn" type="submit">
            {isNew ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

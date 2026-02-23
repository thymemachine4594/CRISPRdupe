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

  const handleSubmit = () => {
    login({ name: name || "Researcher", email })
    navigate("/dashboard")
  }

  return (
    <div className="auth-box">
      <h2>{isNew ? "Create Account" : "Sign In"}</h2>

      {isNew && (
        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="glow-btn" onClick={handleSubmit}>
        {isNew ? "Register" : "Login"}
      </button>

      <p onClick={() => setIsNew(!isNew)} className="toggle">
        {isNew ? "Already user? Sign In" : "New user? Register"}
      </p>
    </div>
  )
}
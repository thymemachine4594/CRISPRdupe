import { BrowserRouter, Routes, Route } from "react-router-dom"
import DNAHelixScene from "./components/DNAHelix"
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import DiagnosisStep1 from "./pages/DiagnosisStep1"
import DiagnosisStep2 from "./pages/DiagnosisStep2"
import DiagnosisStep3 from "./pages/DiagnosisStep3"
import Result from "./pages/Result"
import { AuthProvider } from "./context/authcontext"
import Navbar from "./components/Navbar"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Persistent Background */}
        <DNAHelixScene />

        <Navbar />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnosis/1" element={<DiagnosisStep1 />} />
          <Route path="/diagnosis/2" element={<DiagnosisStep2 />} />
          <Route path="/diagnosis/3" element={<DiagnosisStep3 />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
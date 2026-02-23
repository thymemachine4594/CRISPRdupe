import CircularResult from "../components/CircularResult"

export default function Result() {
  return (
    <div className="page-center">
      <h2>Predicted Diseases</h2>

      <div className="results">
        <CircularResult value={72} label="Sickle Cell" />
        <CircularResult value={18} label="Beta Thalassemia" />
        <CircularResult value={10} label="LTT" />
      </div>

      <p className="warning">
        ⚠️ Please consult a doctor regardless of results.
      </p>
    </div>
  )
}
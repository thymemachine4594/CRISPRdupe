import { useNavigate } from "react-router-dom"
import QuestionContainer from "../components/QuestionContainer"
import { diagnosisFlow } from "../data/diagnosisQuestions"

export default function DiagnosisStep3() {
  const navigate = useNavigate()

  const handleNext = (answers) => {
    console.log("Final Answers:", answers)

    // Later:
    // POST to backend
    // Receive predicted condition
    navigate("/result")
  }

  return (
    <QuestionContainer
      questions={diagnosisFlow.step3}
      onNext={handleNext}
    />
  )
}
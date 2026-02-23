import { useNavigate } from "react-router-dom"
import QuestionContainer from "../components/QuestionContainer"
import { diagnosisFlow } from "../data/diagnosisQuestions"

export default function DiagnosisStep2() {
  const navigate = useNavigate()

  const handleNext = (answers) => {
    console.log("Step 2 Answers:", answers)
    navigate("/diagnosis/3")
  }

  return (
    <QuestionContainer
      questions={diagnosisFlow.step2}
      onNext={handleNext}
    />
  )
}
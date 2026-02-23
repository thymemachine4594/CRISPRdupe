import { useNavigate } from "react-router-dom"
import QuestionContainer from "../components/QuestionContainer"
import { diagnosisFlow } from "../data/diagnosisQuestions"

export default function DiagnosisStep1() {
  const navigate = useNavigate()

  const handleNext = (answers) => {
    console.log("Step 1 Answers:", answers)

    // Later send to backend here

    navigate("/diagnosis/2")
  }

  return (
    <QuestionContainer
      questions={diagnosisFlow.step1}
      onNext={handleNext}
    />
  )
}
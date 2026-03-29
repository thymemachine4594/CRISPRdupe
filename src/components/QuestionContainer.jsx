import { useState } from "react"

export default function QuestionContainer({ questions, onNext }) {
  const [answers, setAnswers] = useState({})
  const [validationMessage, setValidationMessage] = useState("")

  const handleSelect = (questionId, option) => {
    setValidationMessage("")
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }))
  }

  const handleContinue = () => {
    const unansweredQuestions = questions.filter((question) => !answers[question.id])

    if (unansweredQuestions.length > 0) {
      setValidationMessage("Please answer all questions before continuing.")
      return
    }

    onNext(answers)
  }

  return (
    <div className="mcq-wrapper">
      <div className="mcq-container">
        <h2 className="mcq-title">Clinical Assessment</h2>

        {questions.map((q, index) => (
          <div key={q.id} className="mcq-question">
            <p>
              <span className="q-number">Q{index + 1}.</span> {q.question}
            </p>

            <div className="options-grid">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  className={`option-btn ${
                    answers[q.id] === option ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(q.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        {validationMessage && (
          <p className="mcq-validation-message">{validationMessage}</p>
        )}

        <button
          className="glow-btn continue-btn"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

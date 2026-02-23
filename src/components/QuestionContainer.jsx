import { useState } from "react"

export default function QuestionContainer({ questions, onNext }) {
  const [answers, setAnswers] = useState({})

  const handleSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }))
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

        <button
          className="glow-btn continue-btn"
          onClick={() => onNext(answers)}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
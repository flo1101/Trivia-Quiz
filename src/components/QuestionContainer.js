import React, {useEffect, useState} from "react"
import arrowRight from "../images/arrow-right.svg"
import arrowLeft from "../images/arrow-left.svg"
import arrowRotate from "../images/arrow-rotate.svg"
import cross from "../images/xmark.svg"

export default function QuestionContainer(props) {

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0)

    function createQuestionElements(data) {
        return data.results.map(question => ({
            "question": decodeHTMLEntities(question.question),
            "answers": [
                {"answer": decodeHTMLEntities(question.correct_answer), "isCorrect": true},
                {"answer": decodeHTMLEntities(question.incorrect_answers[0]), "isCorrect": false},
                {"answer": decodeHTMLEntities(question.incorrect_answers[1]), "isCorrect": false},
                {"answer": decodeHTMLEntities(question.incorrect_answers[2]), "isCorrect": false}
            ],
            "selectedAnswer": ""
        }))
    }

    useEffect(() => {
        fetchQuestions();
    }, [])

    function fetchQuestions() {
        fetch(`https://opentdb.com/api.php?amount=10&type=multiple`)
            .then(res => res.json())
            .then(data => createQuestionElements(data))
            .then(questionElements => setQuestions(questionElements))
    }

    function nextQuestion() {
        setCurrentQuestion(prev => prev === 9 ? 0 : prev + 1);
    }

    function prevQuestion() {
        setCurrentQuestion(prev => prev === 0 ? 9 : prev - 1);
    }

    function decodeHTMLEntities(text) {
        let textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    return (
        <div className="question-container container">
            <div className="top-bar">
                <div className="top-bar__btn">
                    <button className="btn-circle"><img src={arrowRotate} alt="restart"/></button>
                    <button className="btn-circle"><img src={cross} alt="exit"/></button>
                </div>
                <span>{props.category}</span>
                <button className="btn-submit">Submit Answers</button>
            </div>
            <div className="question">
                <div className="question__top">
                    <div>
                        <h2>{currentQuestion + 1}/10</h2>
                        <h1>{questions[0] && questions[currentQuestion].question}</h1>
                    </div>
                    <div className="question__top-btn">
                        <button onClick={prevQuestion} className="btn-circle"><img src={arrowLeft} alt="arrow-left"/></button>
                        <button onClick={nextQuestion} className="btn-circle"><img src={arrowRight} alt="arrow-right"/></button>
                    </div>
                </div>
                <div className="question__answer-box">
                    <div className="answer"><span className="answer-num">A</span>{questions[0] && questions[currentQuestion].answers[0].answer}</div>
                    <div className="answer"><span className="answer-num">B</span>{questions[0] && questions[currentQuestion].answers[1].answer}</div>
                    <div className="answer"><span className="answer-num">C</span>{questions[0] && questions[currentQuestion].answers[2].answer}</div>
                    <div className="answer"><span className="answer-num">D</span>{questions[0] && questions[currentQuestion].answers[3].answer}</div>
                </div>
            </div>
        </div>
    )
}

// "https://opentdb.com/api.php?amount=10&category=11&type=multiple"
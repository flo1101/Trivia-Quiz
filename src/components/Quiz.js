import React, {useEffect, useState} from "react"
import arrowRight from "../images/arrow-right.svg"
import reload from "../images/arrow-rotate.svg"
import check from "../images/check-dark.svg"
import cross from "../images/xmark-dark.svg"

export default function Quiz(props) {

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);


    useEffect(() => {
        fetchQuestions()
    }, [])

    function fetchQuestions() {
        const categoryString = props.category.id !== 0 ? `&category=${props.category.id}` : "";
        fetch(`https://opentdb.com/api.php?amount=10&type=multiple${categoryString}`)
            .then(res => res.json())
            .then(data => createQuestions(data))
            .then(questionElements => setQuestions(questionElements))
    }

    function createQuestions(data) {
        return data.results.map((question, index) => {
            const answers = [
                {"answer": decodeHTMLEntities(question.correct_answer), "isCorrect": true, "id": ""},
                {"answer": decodeHTMLEntities(question.incorrect_answers[0]), "isCorrect": false, "id": ""},
                {"answer": decodeHTMLEntities(question.incorrect_answers[1]), "isCorrect": false, "id": ""},
                {"answer": decodeHTMLEntities(question.incorrect_answers[2]), "isCorrect": false, "id": ""}
            ]
            const shuffledAnswers = answers
                .map(answer => ({ sort: Math.random(), value: answer}))
                .sort((a, b) => a.sort - b.sort)
                .map((obj, index) => ({ ...obj.value, "id": index }))
            return {
                "id": index,
                "displayed": currentQuestion === index,
                "question": decodeHTMLEntities(question.question),
                "answers": shuffledAnswers,
            }
        })
    }

    function decodeHTMLEntities(text) {
        let textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    function nextQuestion() {
        const info = document.querySelector(".info");
        if (!props.questionAnswered) {
            info.classList.add("display");
            return;
        }
        info.classList.remove("display");
        setCurrentQuestion(prev => prev + 1);
        document.querySelectorAll(".answer").forEach(answer => {
            answer.classList.remove("correct-answer", "wrong-answer")
            answer.querySelector(".answer-icon").src = "";
        })
        props.setQuestionAnswered(false);
    }

    function selectAnswer(e) {
        if (props.questionAnswered) return;
        const answer = e.currentTarget;
        const correctAnswer = questions[currentQuestion].answers.find(answer => answer.isCorrect);
        if (parseInt(answer.id) === correctAnswer.id) {
            answer.classList.add("correct-answer")
            answer.querySelector(".answer-icon").src = check;
            props.setScore(prevState => prevState + 1);
        } else {
            answer.classList.add("wrong-answer")
            answer.querySelector(".answer-icon").src = cross;
            const correctAnswerDiv = document.getElementById(correctAnswer.id);
            correctAnswerDiv.classList.add("correct-answer");
            correctAnswerDiv.querySelector(".answer-icon").src = check;

        }
        props.setQuestionAnswered(true);
    }

    return (
        !questions[0] ?
            <div className="loading">Loading...</div> :
            <div className="question-container container">
                <div className="top-bar">
                    <div className="top-bar__btn">
                        <button onClick={props.endRound} className="btn-circle"><img src={reload} alt="exit"/></button>
                    </div>
                    <span>{props.category.name} </span>
                    <div>Score: {props.score}</div>
                </div>
                <div className="question">
                    <div className="question__top">
                        <div>
                            <h3>{currentQuestion + 1}/10</h3>
                            <div className="question__top-btn">
                                {
                                    currentQuestion === 9 ?
                                        <button onClick={props.submit}>Finish Quiz</button> :
                                        <button onClick={nextQuestion} className="btn-circle"><img src={arrowRight} alt="arrow-right"/></button>
                                }
                            </div>
                        </div>
                        <h2>{questions[currentQuestion].question}</h2>
                    </div>
                    <div>
                        <div className="answer" id="0" onClick={selectAnswer}>
                            <div>
                                <span className="answer-num">A</span>
                                {questions[currentQuestion].answers[0].answer}
                            </div>
                            <img className="answer-icon" src="" alt=""/>
                        </div>
                        <div className="answer" id="1" onClick={selectAnswer}>
                            <div>
                                <span className="answer-num">B</span>
                                {questions[currentQuestion].answers[1].answer}
                            </div>
                            <img className="answer-icon" src="" alt=""/>
                        </div>
                        <div className="answer" id="2" onClick={selectAnswer}>
                            <div>
                                <span className="answer-num">C</span>
                                {questions[currentQuestion].answers[2].answer}
                            </div>
                            <img className="answer-icon" src="" alt=""/>
                        </div>
                        <div className="answer" id="3" onClick={selectAnswer}>
                            <div>
                                <span className="answer-num">D</span>
                                {questions[currentQuestion].answers[3].answer}
                            </div>
                            <img className="answer-icon" src="" alt=""/>
                        </div>
                        <span className="info">Please answer the question to continue.</span>
                    </div>
                </div>
            </div>
    )
}

// "https://opentdb.com/api.php?amount=10&category=11&type=multiple"
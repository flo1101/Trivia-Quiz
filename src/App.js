import React, {useEffect, useState} from "react"
import Quiz from "./components/Quiz";

export default function App() {

  const [allCategories, setAllCategories] = useState([])
  const [category, setCategory] = useState({"id": 0, "name": "All Categories"});
  const [gameRunning, setGameRunning] = useState(false);
  const [gameFinished, setGameFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [questionAnswered, setQuestionAnswered] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("https://opentdb.com/api_category.php")
      const data = await res.json()
      setAllCategories(data.trivia_categories)
    }
    fetchCategories();
  }, [])

  function startQuiz() {
    setGameRunning(true)
  }

  function selectCategory(e) {
    const dropdown = e.target;
    const name = dropdown.options[dropdown.selectedIndex].text;
    setCategory({ "id": dropdown.value, "name": name })
  }

  function endRound() {
    setGameRunning(false);
    setGameFinished(false);
    setScore(0)
  }


  function submitAnswers() {
    const info = document.querySelector(".info");
    if (!questionAnswered) {
      info.classList.add("display");
      return;
    }
    info.classList.remove("display");
    setGameRunning(false)
    setGameFinished(true)
    setQuestionAnswered(false)
  }

  let categoryOptions = `<option value="">All categories</option>`;
  allCategories.forEach(category => {
    categoryOptions += `<option value=${category.id}>${category.name}</option>`
  })

  function getPageContent() {
    if (gameFinished) {
      return (
          <div className="container finish-screen">
            <h2>You scored {score}/10 points!</h2>
            <button onClick={endRound}>Play again</button>
          </div>
      )
    } else if (gameRunning) {
      return (
          <Quiz
              category={category}
              endRound={endRound}
              submit={submitAnswers}
              score={score}
              setScore={setScore}
              questionAnswered={questionAnswered}
              setQuestionAnswered={setQuestionAnswered}
          />
      )
    } else {
      return (
          <div className="container landing-page">
            <h1>Welcome to<br/> the Trivia Quiz!</h1>
            <p>This Quiz-Website is using questions provided by the Open Trivia API.<br/>
              Every round consists of 10 questions from your chosen category.<br/>
              To get started choose a category and click “Start Quiz”<span className=""></span></p>
            <div className="category-dropdown">
              <select className="dropdown" onChange={selectCategory} name="category" id="category" dangerouslySetInnerHTML={{__html: categoryOptions}}>
              </select>
            </div>
            <button className="btn" onClick={startQuiz}>Start Quiz</button>
          </div>
      )
    }
  }

  return (
          <main>
            <div className="shape-left"></div>
            <div className="shape-right"></div>
            {getPageContent()}
          </main>
  );
}

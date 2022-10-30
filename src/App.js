import React, {useEffect, useState} from "react"
import LandingPage from "./components/LandingPage";
import QuestionContainer from "./components/QuestionContainer";

export default function App() {

  const [allCategories, setAllCategories] = useState([])
  const [category, setCategory] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("https://opentdb.com/api_category.php")
      const data = await res.json()
      setAllCategories(data.trivia_categories)
    }
    fetchCategories();
  }, [])

  function startQuiz() {
    setStarted(true)
  }

  return (
    <main>
      {
        started ?
            <QuestionContainer
                category={category}
            /> :
            <LandingPage
                category={category}
                allCategories={allCategories}
                setCategory={setCategory}
                startQuiz={startQuiz}
            />
      }

    </main>
  );
}

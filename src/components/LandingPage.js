import React from "react";
import arrowDown from "../images/arrow-down.svg"

export default function LandingPage(props) {


    return (
        <div className="container landing-page">
            <h1>Welcome to<br/> the Trivia Quiz!</h1>
            <p>This is a Quiz-Website using questions provided by the Open Trivia API.<br/>
                Every round consists of 10 questions from your chosen category.<br/>
                To get started choose a category and click “Start Quiz”. Have fun!</p>
            <div className="category-dropdown">
                {props.category !== "" ?  props.category : "All categories"}
                <div className="icon-box">
                    <img src={arrowDown} alt="test"/>
                </div>
            </div>
            <button className="btn" onClick={props.startQuiz}>Start Quiz</button>
        </div>
    )
}
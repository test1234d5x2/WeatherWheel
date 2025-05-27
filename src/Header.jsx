import React from "react";


// Dsplays the header links to the user.
export function Header(props) {
    return (
        <header>
            <div className="headerNav">
                <span className="logo"><img src={require('./css/assets/logo.png')} alt="Logo" /></span>
            </div>

            {/* Each headerNav div contains a span element that when clicked, changes the data displayed*/}
            {/*on the main page. This is achieved by invoking the changeDataShown method passed as a prop.*/}
            <div className="headerNav">
                <span className="headerText" onClick={() => {props.changeDataShown("home")}}>Home</span>
            </div>

            <div className="headerNav">
                <span className="headerText" onClick={() => {props.changeDataShown("map")}}>Map</span>
            </div>

            <div className="headerNav">
                <span className="headerText" onClick={() => {props.changeDataShown("advice")}}>Advice</span>
            </div>

            <div className="headerNav">
                <span className="headerText" onClick={() => {props.changeDataShown("details")}}>More Details</span>
            </div>
        </header>
    )
}

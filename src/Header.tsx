import React from "react";
import ShowingPage from "./types/pageType";

interface HeaderProps {
    changeDataShown: (newDataToBeShown: ShowingPage) => void;
}


export const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <div className="headerNav">
                <span className="logo">
                    <img src={require('./css/assets/logo.png')} alt="Logo" />
                </span>
            </div>

            <div className="headerNav">
                <span className="headerText" onClick={() => { props.changeDataShown("home") }}>Home</span>
            </div>

            <div className="headerNav">
                <span className="headerText" onClick={() => { props.changeDataShown("map") }}>Map</span>
            </div>
            
            <div className="headerNav">
                <span className="headerText" onClick={() => { props.changeDataShown("details") }}>More Details</span>
            </div>
        </header>
    );
}

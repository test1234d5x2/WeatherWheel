import React, { useState, useCallback } from "react";
import { Header } from "./Header";
import { Main } from "./Main";
import ShowingPage from "./types/pageType";

interface ContainerProps {}


export const Container: React.FC<ContainerProps> = () => {
    const [showing, setShowing] = useState<ShowingPage>("home")

    const changeDataShown = useCallback((newDataToBeShown: ShowingPage): void => {
        setShowing(newDataToBeShown);
    }, [])

    return (
        <div className="main-container">
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            <Header changeDataShown={changeDataShown} />
            <Main showing={showing} />
        </div>
    );
};

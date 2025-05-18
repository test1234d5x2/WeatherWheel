import React from "react"
import { Header } from "./Header"
import { Main } from "./Main"

export class Container extends React.Component {

    constructor(props) {
        super(props)

        // Default view of the page is the home page. It was chosen like that as this is the page that users will want to see the most anyway.
        this.state = {
            showing: "home",
        }

        this.changeDataShown = this.changeDataShown.bind(this)
    }

    /**
     * 
     * @method changeDataShown
     * @param {String} newDataToBeShown 
     * @description Keeps track of which page the user has selected to be displayed. Can be aany one of these options: "home", "map", "advice and "details". Navigation is done via the header links.
     * @returns null/undefined
     * 
     */
    changeDataShown(newDataToBeShown) {
        this.setState({showing: newDataToBeShown})

        return
    }

    render() {
        return (
            <div className="main-container">
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
                <Header changeDataShown={this.changeDataShown} />
                <Main showing={this.state.showing} />
            </div> 
        )
    }

}

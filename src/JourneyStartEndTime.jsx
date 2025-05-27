import React from "react";


// Allows the user to select the start and end times of their jouney.
export class JourneyStartEndTime extends React.Component {

    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <div>
                <div className="displayTimes">
                    <div className="timeText">From: </div>
                    <div className="times"> 9:00     26/02/2024</div>
                </div>
                <div className="displayTimes">
                    <div className="timeText">To: </div>
                    <div className="times"> 16:00     26/02/2024</div>
                </div>
            </div>
        )
    }

}

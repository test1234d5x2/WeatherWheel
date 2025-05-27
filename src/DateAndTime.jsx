
import { useState } from "react";

const DateandTime = ({ handleCallback }) => {
     
    // Function to get the current time in HH:MM format
    const getCurrentTime = () => {
        const today = new Date();
        const hours = (`0${today.getHours()}`).slice(-2); // Format hours to 2 digits
        const minutes = (`0${today.getMinutes()}`).slice(-2); // Format minutes to 2 digits
        return `${hours}:${minutes}`;
    };

    // State hooks for start and end times, initialized to the current time
    const [startTime, setStartTime] = useState(getCurrentTime());
    const [endTime, setEndTime] = useState(getCurrentTime());

    // Handler for start time change event
    const handleStartTimeChange = (e) => setStartTime(e.target.value);

    // Handler for end time change event
    const handleEndTimeChange = (e) => setEndTime(e.target.value);

    // Handler for submit event
    const handleSubmit = (e) => {
        if (startTime && endTime) {
            handleCallback(startTime, endTime);
        } else {
            // Alert the user if either start or end time is missing
            alert("Please select both date and time.");
        }
    };

    // Handler for reset event, sets both start and end times to the current time
    const handleReset = () => {
        setStartTime(getCurrentTime());
        setEndTime(getCurrentTime());
    };

    return (
        <div className="inputContainer"> 
            <div className="timeInputGroup">
                <p className="dateAndTimeText">Start:</p>
                <input className="timeInput" type="time" onChange={handleStartTimeChange} value={startTime} />
            </div>
            <div className="timeInputGroup"> 
                <p className="dateAndTimeText">End:</p>
                <input className="timeInput" type="time" onChange={handleEndTimeChange} value={endTime} />
            </div>
            <div className="buttonGroup"> 
                <button onClick={handleSubmit}>Done</button> 
                <button onClick={handleReset}>Reset</button> 
            </div>
        </div>
    );
};

export default DateandTime;

import React, { useState } from "react";
import VehicleType from "./types/vehicleType";
import { useDispatch } from "react-redux";
import { setVehicleType } from "./store/vehicleStore";


const IMAGES_PATH = {
    "car": require('./css/assets/vehicle.png'),
    "motorbike": require('./css/assets/motorbike.png'),
    "van": require('./css/assets/van.png')
}


export const VehicleSelection: React.FC = () => {
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const dispatch = useDispatch()

    const moveSlide = (step: number): void => {
        let newSlideIndex: number = slideIndex + step;

        if (newSlideIndex >= Object.keys(IMAGES_PATH).length) {
            newSlideIndex = 0;
        }

        else if (newSlideIndex < 0) {
            newSlideIndex = Object.keys(IMAGES_PATH).length - 1;
        }

        setSlideIndex(newSlideIndex)


        let vehicle: VehicleType;
        if (newSlideIndex === 1) {
            vehicle = {vehicle: 'motorbike'}
        } else if (newSlideIndex === 2) {
            vehicle = {vehicle: 'van'}
        } else {
            vehicle = {vehicle: 'car'}
        }

        dispatch(setVehicleType(vehicle))
    };

    return (
        <div id="carousel" className="vehicleSelector">
            <span className="arrow" onClickCapture={() => moveSlide(-1)}>&#8592;</span>
            <div className="carousel-images">
                <img alt="vehicle" className="carousel-image" src={Object.values(IMAGES_PATH)[slideIndex]} />
            </div>
            <span className="arrow" onClick={() => moveSlide(1)}>&#8594;</span>
        </div>
    );
};

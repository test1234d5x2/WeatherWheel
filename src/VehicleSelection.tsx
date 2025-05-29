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
        <div>
            <div id="carousel" className="carousel">
                <div className="carousel-images">
                    <img alt="vehicle" className="carousel-image" src={Object.values(IMAGES_PATH)[slideIndex]} />
                </div>
                <button className="carousel-button prev" onClick={() => { moveSlide(-1); }}>&#10094;</button>
                <button className="carousel-button next" onClick={() => { moveSlide(1); }}>&#10095;</button>
            </div>
        </div>
    );
};

import React, { useState, useCallback } from "react";
import VehicleType from "./types/vehicleType";

// Define the paths to the vehicle images.
// Using `require()` for image paths is common in Create React App setups.
const IMAGES_PATH: string[] = [
    require('./css/assets/vehicle.png'), // Assuming this is the 'car' image
    require('./css/assets/motorbike.png'),
    require('./css/assets/van.png')
];


// Define the interface for the VehicleSelection component's props.
interface VehicleSelectionProps {
    setVehicle: (vehicle: VehicleType) => void; // Function to update the parent component with the chosen vehicle.
}

/**
 * @function VehicleSelection
 * @param {VehicleSelectionProps} props - The properties passed to the component.
 * @description A functional component for selecting a vehicle using a carousel.
 * It displays different vehicle images and allows navigation between them,
 * updating the parent component with the selected vehicle type.
 */
export const VehicleSelection: React.FC<VehicleSelectionProps> = ({ setVehicle }) => {
    // State to keep track of the current slide index in the carousel.
    const [slideIndex, setSlideIndex] = useState<number>(0);
    // State to hold the path of the currently displayed image.
    const [chosenImagePath, setChosenImagePath] = useState<string>(IMAGES_PATH[0]);

    /**
     * @function moveSlide
     * @param {number} step - The number of steps to move the carousel (e.g., -1 for previous, 1 for next).
     * @description Handles the logic for navigating the carousel slides.
     * It updates the slide index and the displayed image, and also informs
     * the parent component about the newly selected vehicle type.
     */
    const moveSlide = useCallback((step: number): void => {
        setSlideIndex(prevSlideIndex => {
            let newSlideIndex: number = prevSlideIndex + step;

            // Looping back to the first slide if we exceed the number of slides.
            if (newSlideIndex >= IMAGES_PATH.length) {
                newSlideIndex = 0;
            }
            // Going to the last slide if we move back before the first slide.
            else if (newSlideIndex < 0) {
                newSlideIndex = IMAGES_PATH.length - 1;
            }

            const newChosenImagePath: string = IMAGES_PATH[newSlideIndex];

            // Determine the vehicle type based on the new slide index.
            let vehicle: VehicleType;
            if (newSlideIndex === 1) {
                vehicle = "motorbike";
            } else if (newSlideIndex === 2) {
                vehicle = "van";
            } else {
                vehicle = "car"; // Default for index 0
            }

            // Update the parent component with the new vehicle type.
            setVehicle(vehicle);

            // Update the chosen image path state.
            setChosenImagePath(newChosenImagePath);

            return newSlideIndex; // Return the new slide index for the state update.
        });
    }, [setVehicle]); // Dependency array includes setVehicle to ensure the callback is stable

    return (
        <div>
            <div id="carousel" className="carousel">
                <div className="carousel-images">
                    <img alt="vehicle" className="carousel-image" src={chosenImagePath} />
                </div>
                {/* Buttons to navigate the carousel */}
                <button className="carousel-button prev" onClick={() => { moveSlide(-1); }}>&#10094;</button>
                <button className="carousel-button next" onClick={() => { moveSlide(1); }}>&#10095;</button>
            </div>
        </div>
    );
};

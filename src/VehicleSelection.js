import React from "react";

const IMAGES_PATH = [
	require('./css/assets/vehicle.png'),
	require('./css/assets/motorbike.png'),
	require('./css/assets/van.png')
];

export class VehicleSelection extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			slideIndex: 0,
			chosenImagePath: IMAGES_PATH[0],
		};

		this.moveSlide = this.moveSlide.bind(this);
	}

	moveSlide(step) {
		this.setState((prevState) => {
			let newSlideIndex = prevState.slideIndex + step;

			// Looping back to the first slide if we exceed the number of slides
			if (newSlideIndex >= IMAGES_PATH.length) {
				newSlideIndex = 0;
			}
			// Going to the last slide if we move back before the first slide
			else if (newSlideIndex < 0) {
				newSlideIndex = IMAGES_PATH.length - 1;
			}

			const chosenImagePath = IMAGES_PATH[newSlideIndex];

			// Determine the vehicle type based on the new slide index
			let vehicle = "";
			if (newSlideIndex === 1) {
				vehicle = "motorbike";
			} else if (newSlideIndex === 2) {
				vehicle = "van";
			} else {
				vehicle = "car";
			}

			// Update the parent component with the new vehicle type
			this.props.setVehicle(vehicle);

			return { slideIndex: newSlideIndex, chosenImagePath };
		});
	}

	render() {
		return (
			<div>
				<div id="carousel" className="carousel">
					<div className="carousel-images">
						<img alt="vehicle" className="carousel-image" src={this.state.chosenImagePath} />
					</div>
					{/* Buttons to navigate the carousel */}
					<button className="carousel-button prev" onClick={() => { this.moveSlide(-1); }}>&#10094;</button>
					<button className="carousel-button next" onClick={() => { this.moveSlide(1); }}>&#10095;</button>
				</div>
			</div>
		);
	}
}


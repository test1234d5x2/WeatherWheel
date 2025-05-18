import React from 'react';


// Allows the user to edit sections of text and toggle their editability.
export class EditableComponent extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			"entryValue": this.props.name !== null ? this.props.name : "Location", // If the name prop is empty, display default text "Location" to the suer which implies to te suer that a destination is required.
			"editable": false,
			"selectable": false,
			"potentialLocations": [],
		}

		this.displaySelectableArea = this.displaySelectableArea.bind(this)
		this.hideSelectableArea = this.hideSelectableArea.bind(this)
		this.toggleEditableArea = this.toggleEditableArea.bind(this)
		this.updateEntryValue = this.updateEntryValue.bind(this)
		this.findPotentialLocations = this.findPotentialLocations.bind(this)
	}

	/**
	 * 
     * @method: toggleEditableArea
     * @description: Toggles the editable state of the component.
	 * @returns null/undefined
     */
	toggleEditableArea() {

		// Check whether the user has actually entered something.
		if (this.state.editable === true && this.state.entryValue === "") {
			return
		}

		this.setState((state) => {
			return {
				"editable": !this.state.editable,
			}
		})
	}

	/**
	 * 
     * @method: findPotentialLocations
     * @description: Fetches potential locations based on the entered value.
	 * @returns null/undefined
     */
	findPotentialLocations() {
		fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + this.state.entryValue + "&limit=5&appid=" + process.env.REACT_APP_OPENWEATHER_API_KEY)
		.then((response) => {return response.json()})
		.then((data) => {
			// Checks whether the user has entered a place that the API can find.
			if (data.length === 0) {
				return window.alert("This is not a valid location. Please enter something different.")
			}

			this.setState((state) => {
				return {
					"potentialLocations": data,
				}
			})

			// Once selected and valid, we don't want the user to see the other remaining options.
			this.displaySelectableArea()
		})
	}

	/**
	 * 
     * @method: displaySelectableArea
     * @description: Displays the selectable area.
	 * @returns null/undefined
	 * 
     */
	displaySelectableArea() {
		this.setState((state) => {
			return {
				"selectable": true
			}
		})
	}

	/**
	 * 
     * @method: hideSelectableArea
     * @description: Hides the selectable area.
	 * @returns null/undefined.
	 * 
     */
	hideSelectableArea() {
		this.setState((state) => {
			return {
				"selectable": false
			}
		})
	}

	/**
	 * 
     * @method: updateEntryValue
     * @description: Updates the entry value in the state.
     * @param {String} value - The new value that updates the state.
	 * @returns null/undefined.
	 * 
     */
	updateEntryValue(value) {
		this.setState((state) => {
			return {
				"entryValue": value,
			}
		})
	}

	render() {
		let selectableLocations = <div></div>

		// Shows the loading text when the API is still finding potential locations to return. Stops a null error from occurring if there's nothing to display.
		if (this.state.potentialLocations.length === 0) {
			selectableLocations = (
				<div>Loading...</div>
			)
		}

		else {
			selectableLocations = this.state.potentialLocations.map(
				(item) => {
					return <span onClick={(event) => {return [this.hideSelectableArea(), this.toggleEditableArea(), this.props.updateLocationInfo(item['lat'], item['lon'], item['name'] + ", " + (item['state'] !== undefined ? item['state'] + ", " : "") + item['country'])]}}>{item['name']}, {item['state'] !== undefined ? item['state'] + "," : ""} {item['country']}</span>
				}
			)
		}

		return (
			<div className='editableComponent'>
				<div className='editableArea'>
					{
						this.state.editable === true ? 
							<input value={this.state.entryValue} onChange={(event) => {this.updateEntryValue(event.target.value)}} /> : 
							<span>{this.props.name !== null ? this.props.name: "Location"}</span>
					}
					
					{
						this.state.editable === true ? 
							<span className='material-symbols-outlined icon' onClick={(event) => {return this.findPotentialLocations()}}>search</span> :
							<span className='material-symbols-outlined icon' onClick={(event) => {this.toggleEditableArea()}}>edit</span> }
				</div>
				<div className='selectableArea'>
					{this.state.selectable === true ? selectableLocations: ""}
				</div>
			</div>
		)
	}
}

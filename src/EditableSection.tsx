import React, { useState, useCallback, useEffect, JSX } from "react";

// Define the interface for a single geographical location object
interface GeoLocationData {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string; // 'state' is optional as it might not always be present
}

// Define the interface for the EditableComponent's props
interface EditableComponentProps {
    name: string | null; // The initial name/location to display, can be null
    updateLocationInfo: (lat: number, long: number, name: string) => void; // Callback to update parent's location info
}

/**
 * @function EditableComponent
 * @param {EditableComponentProps} props - The properties passed to the component.
 * @description Allows the user to edit sections of text (representing a location),
 * search for potential locations via an API, and toggle their editability.
 */
export const EditableComponent: React.FC<EditableComponentProps> = ({ name, updateLocationInfo }) => {
    const [entryValue, setEntryValue] = useState<string>(name !== null ? name : "Location");
    const [editable, setEditable] = useState<boolean>(false);
    const [selectable, setSelectable] = useState<boolean>(false);
    const [potentialLocations, setPotentialLocations] = useState<GeoLocationData[]>([]);

    useEffect(() => {
        if (name !== null) {
            setEntryValue(name);
        }
    }, [name]); // Dependency array: re-run effect if 'name' prop changes

    /**
     * @function toggleEditableArea
     * @description Toggles the editable state of the component.
     * If switching from editable to non-editable, and the input is empty, it prevents the change.
     */
    const toggleEditableArea = useCallback((): void => {
        // Check whether the user has actually entered something before toggling off editable mode
        if (editable === true && entryValue === "") {
            // In a real application, you might show a user-friendly message here (e.g., a modal)
            console.warn("Location entry cannot be empty.");
            return;
        }
        setEditable(prevEditable => !prevEditable);
        // When toggling editable, hide selectable area
        setSelectable(false);
    }, [editable, entryValue]);

    /**
     * @function findPotentialLocations
     * @description Fetches potential locations based on the entered value using OpenWeatherMap Geo API.
     * Displays an alert if no valid locations are found.
     */
    const findPotentialLocations = useCallback(async (): Promise<void> => {
        if (entryValue === "") {
            console.warn("Please enter a location to search.");
            return;
        }

        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(entryValue)}&limit=5&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`);
            const data: GeoLocationData[] = await response.json();

            // Checks whether the user has entered a place that the API can find.
            if (data.length === 0) {
                // Using console.error instead of window.alert for better UX in an immersive environment
                console.error("This is not a valid location. Please enter something different.");
                setPotentialLocations([]); // Clear previous potential locations
                setSelectable(false); // Hide selectable area if no results
                return;
            }

            setPotentialLocations(data);
            // Once valid locations are found, display the selectable area.
            setSelectable(true);
        } catch (error) {
            console.error("Error fetching potential locations:", error);
            setPotentialLocations([]); // Clear potential locations on error
            setSelectable(false); // Hide selectable area on error
        }
    }, [entryValue]); // Dependency: entryValue, as the fetch depends on it

    /**
     * @function updateEntryValue
     * @param {string} value - The new value that updates the state.
     * @description Updates the entry value in the state.
     */
    const updateEntryValueHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        setEntryValue(event.target.value);
    }, []);

    // JSX for rendering the selectable locations list
    let selectableLocations: JSX.Element;

    if (potentialLocations.length === 0) {
        selectableLocations = (
            <div className="loadingText">Loading...</div> // Or "No results found" if search returned empty
        );
    } else {
        selectableLocations = (
            <>
                {potentialLocations.map((item: GeoLocationData, index: number) => (
                    <span
                        key={index} // Using index as key is acceptable here as the list is static and not reordered
                        onClick={() => {
                            // Hide selectable area, toggle editable mode, and update parent's location info
                            setSelectable(false);
                            setEditable(false); // Toggle off editable mode after selection
                            // Construct the full location name
                            const fullName = `${item.name}, ${item.state ? item.state + ", " : ""}${item.country}`;
                            updateLocationInfo(item.lat, item.lon, fullName);
                            setEntryValue(fullName); // Update the input field with the selected full name
                        }}
                    >
                        {item.name}, {item.state ? item.state + "," : ""} {item.country}
                    </span>
                ))}
            </>
        );
    }

    return (
        <div className='editableComponent'>
            <div className='editableArea'>
                {
                    editable === true ?
                        <input
                            value={entryValue}
                            onChange={updateEntryValueHandler}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    findPotentialLocations(); // Trigger search on Enter key press
                                }
                            }}
                        /> :
                        <span>{name !== null ? name : "Location"}</span>
                }

                {
                    editable === true ?
                        <span className='material-symbols-outlined icon' onClick={findPotentialLocations}>search</span> :
                        <span className='material-symbols-outlined icon' onClick={toggleEditableArea}>edit</span>
                }
            </div>
            <div className='selectableArea'>
                {selectable === true ? selectableLocations : null}
            </div>
        </div>
    );
};

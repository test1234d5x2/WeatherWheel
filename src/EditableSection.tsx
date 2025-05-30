import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPlaceName, setMapLocation } from "./store/locationStore";

interface GeoLocationData {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string; // 'state' is optional as it might not always be present
}



interface EditableSectionProps {
    editable: boolean
    selectable: boolean
    setEditable: (value: boolean) => void
    setSelectable: (value: boolean) => void
}


export const EditableComponent: React.FC<EditableSectionProps> = ({editable, selectable, setEditable, setSelectable}: EditableSectionProps) => {
    const name = useSelector(selectPlaceName)
    const dispatch = useDispatch()

    const [entryValue, setEntryValue] = useState<string>(name);
    const [potentialLocations, setPotentialLocations] = useState<GeoLocationData[]>([]);

    useEffect(() => {
        if (name !== null) {
            setEntryValue(name);
        }
    }, [name]); 


    const toggleEditableArea = () => {
        if (editable === true && entryValue === "") {
            return;
        }
        closeEditableArea()
    };

    const closeEditableArea = () => {
        setEditable(!editable);
        setSelectable(false);
    }


    const findPotentialLocations = useCallback(async (): Promise<void> => {
        if (entryValue === "") {
            console.warn("Please enter a location to search.");
            return;
        }

        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(entryValue)}&limit=5&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`);
            const data: GeoLocationData[] = await response.json();

            if (data.length === 0) {
                console.error("This is not a valid location. Please enter something different.");
                setPotentialLocations([])
                setSelectable(false)
                return
            }

            setPotentialLocations(data);
            setSelectable(true);
        } catch (error) {
            console.error("Error fetching potential locations:", error);
            setPotentialLocations([]); 
            setSelectable(false);
        }
    }, [entryValue, setSelectable]);

    const updateEntryValueHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        setEntryValue(event.target.value);
    }, []);

    let selectableLocations;

    if (potentialLocations.length === 0) {
        selectableLocations = (
            <div className="loadingText">Loading...</div>
        );
    } else {
        selectableLocations = (
            <React.Fragment>
                {potentialLocations.map((item: GeoLocationData, index: number) => (
                    <span className="selectable"
                        key={index}
                        onClick={() => {
                            const fullName = `${item.name}, ${item.state ? item.state + ", " : ""}${item.country}`;
                            dispatch(setMapLocation({name: fullName, coordinates: {lat: item.lat, lng: item.lon}}))
                            setEntryValue(fullName);
                            setSelectable(false);
                            setEditable(false);
                        }}
                    >
                        {item.name}, {item.state ? item.state + "," : ""} {item.country}
                    </span>
                ))}
            </React.Fragment>
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
                        <span>{name}</span>
                }

                {
                    editable === true ?
                        <div>
                            <span className='material-symbols-outlined icon' onClick={findPotentialLocations}>search</span>
                            <span className='material-symbols-outlined icon' onClick={() => {closeEditableArea()}}>close</span>
                        </div>
                        :
                        <span className='material-symbols-outlined icon' onClick={toggleEditableArea}>edit</span>
                }
            </div>
            <div className='selectableArea'>
                {selectable === true ? selectableLocations : null}
            </div>
        </div>
    );
};

import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { ref, set, onValue } from "firebase/database";
import { database } from "./firebase-config";

const marks = [
    { value: 0, label: '0%' },
    { value: 10, label: '10%' },
    { value: 20, label: '20%' },
    { value: 30, label: '30%' },
    { value: 40, label: '40%' },
    { value: 50, label: '50%' },
    { value: 60, label: '60%' },
    { value: 70, label: '70%' },
    { value: 80, label: '80%' },
    { value: 90, label: '90%' },
    { value: 100, label: '100%' }
];

// valuetext - Returns formatted percentage string.
function valuetext(value) {
    return `${value}%`;
}

// SliderDoor Component - Renders the slider with input and updates Firebase with debounce.
export default function SliderDoor() {
    const [value, setValue] = React.useState(0);
    const updateTimeoutRef = React.useRef(null);

    // updateFirebase - Updates the slider value to Firebase.
    const updateFirebase = (newValue) => {
        const controlRef = ref(database, 'Kontrol/PintuAir');
        set(controlRef, newValue).catch(console.error);
    };

    // debouncedSend - Sends the slider update to Firebase with debounce.
    const debouncedSend = (newValue) => {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        updateTimeoutRef.current = setTimeout(() => {
            updateFirebase(newValue);
        }, 500);
    };

    // handleSliderChange - Handles the slider value changes.
    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        debouncedSend(newValue);
    };

    // handleInputChange - Handles manual input value changes.
    const handleInputChange = (event) => {
        const val = event.target.value === '' ? '' : Number(event.target.value);
        if (val === '') {
            setValue('');
        } else if (val >= 0 && val <= 100) {
            setValue(val);
            debouncedSend(val);
        }
    };

    // handleBlur - Handles the blur event on the input and ensures the value is within range.
    const handleBlur = () => {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        let newValue = value;
        if (value === '' || value < 0) {
            newValue = 0;
            setValue(0);
        } else if (value > 100) {
            newValue = 100;
            setValue(100);
        }
        updateFirebase(newValue);
    };

    // useEffect - Synchronizes the slider value with the value from Firebase.
    React.useEffect(() => {
        const doorRef = ref(database, 'Kontrol/PintuAir');
        const unsubscribe = onValue(doorRef, (snapshot) => {
            const newValue = snapshot.val();
            if (newValue !== null && newValue !== value) {
                setValue(newValue);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
                minWidth: 450,
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                backgroundColor: '#fefefe',
            }}
            className="card-container"
        >
            <Slider
                aria-label="Custom marks"
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={valuetext}
                step={5}
                marks={marks}
                sx={{
                    flexGrow: 1,
                    color: '#1976d2',
                    '& .MuiSlider-thumb': {
                        width: 25,
                        height: 25,
                        boxShadow: '0 0 5px rgba(25, 118, 210, 0.6)',
                    },
                    '& .MuiSlider-track': {
                        height: 10,
                        borderRadius: 10,
                        marginLeft: 0,
                        marginRight: 0,
                    },
                    '& .MuiSlider-rail': {
                        height: 10,
                        borderRadius: 5,
                        marginLeft: 0,
                        marginRight: 0,
                    },
                    '& .MuiSlider-mark': {
                        backgroundColor: '#1976d2',
                        height: 0,
                    },
                    '& .MuiSlider-markLabel': {
                        fontSize: '0.75rem',
                        color: '#555',
                    },
                }}
            />
            <MuiInput
                value={value}
                size="small"
                onChange={(e) => {
                    const val = e.target.value === '' ? '' : Number(e.target.value);
                    if (val === '' || (val >= 0 && val <= 100)) {
                        handleInputChange(e);
                    }
                }}
                onBlur={handleBlur}
                inputProps={{
                    step: 5,
                    min: 0,
                    max: 100,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                    style: {
                        textAlign: 'center',
                        padding: '8px 14px',
                        borderRadius: 10,
                        border: '2px solid #1976d2',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        width: 60,
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.12)',
                    }
                }}
                sx={{
                    '&:hover': {
                        '& input': {
                            borderColor: '#115293',
                        }
                    },
                    '& input:focus': {
                        borderColor: '#115293',
                        outline: 'none',
                        boxShadow: '0 0 8px #90caf9',
                    }
                }}
            />
        </Box>
    );
}

import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { ref, set, onValue } from "firebase/database"; // Import Firebase functions
import { database } from "./firebase-config"; // Import your firebase config
import "./CSS/Controller.css"; // Import the CSS

// Membuat marks untuk slider
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

function valuetext(value) {
  return `${value}%`; // Tampilan format slider (misalnya: 25% torsi)
}

export default function SliderDoor() {
  const [value, setValue] = React.useState(0);

  // Fungsi untuk mengupdate nilai ke Firebase setiap kali slider digeser
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);

    // Kirimkan nilai ke Firebase di path "Kontrol/PintuAir"
    const controlRef = ref(database, 'Kontrol/PintuAir');
    set(controlRef, newValue)  // Menyimpan nilai slider ke Firebase
      .then(() => {
        console.log("Slider value successfully updated to Firebase:", newValue);
      })
      .catch((error) => {
        console.error("Failed to update slider value to Firebase:", error);
      });
  };

  // Gunakan useEffect untuk mendengarkan perubahan nilai slider dari Firebase
  React.useEffect(() => {
    const doorRef = ref(database, 'Kontrol/PintuAir');
    
    // Menggunakan onValue untuk mendengarkan perubahan nilai di Firebase
    onValue(doorRef, (snapshot) => {
      const newValue = snapshot.val();
      if (newValue !== null) {
        setValue(newValue); // Update nilai slider dengan nilai terbaru dari Firebase
      }
    });
  }, []);  // Empty dependency array berarti hanya dijalankan sekali saat komponen pertama kali di-mount

  return (
    <Box sx={{ width: '100%', marginTop: 8 }} className="card-container">
      <Slider
        aria-label="Custom marks"
        value={value}
        onChange={handleSliderChange} // Panggil fungsi saat slider digeser
        valueLabelDisplay="auto"
        valueLabelFormat={valuetext}
        step={5}
        marks={marks}
        className="slider"
      />
    </Box>
  );
}

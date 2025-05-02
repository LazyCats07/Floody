import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { ref, set } from "firebase/database"; // Import Firebase functions
import { database } from "./firebase-config"; // Import your firebase config
import "./CSS/Controller.css"; // Import the CSS

// Membuat marks untuk slider
const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  }
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
    set(controlRef, newValue)  // Menyimpan nilai torsi ke Firebase
      .then(() => {
        console.log("Torsi berhasil diupdate ke Firebase:", newValue);
      })
      .catch((error) => {
        console.error("Gagal mengupdate torsi ke Firebase:", error);
      });
  };

  return (
    <Box sx={{ width: '100%', marginTop: 8 }} className="card-container">
      <Slider
        aria-label="Custom marks"
        value={value}
        onChange={handleSliderChange} // Panggil fungsi saat slider digeser
        valueLabelDisplay="auto"
        valueLabelFormat={valuetext}
        step={25}
        marks={marks}
        className="slider"
      />
    </Box>
  );
}

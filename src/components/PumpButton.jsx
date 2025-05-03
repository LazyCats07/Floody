import * as React from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel, Switch, Typography } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import { red } from '@mui/material/colors';
import { ref, set, onValue } from "firebase/database"; // Import firebase functions
import { database } from "./firebase-config"; // Import database connection

import "./CSS/Controller.css";  // Import CSS untuk responsivitas

export default function PumpButton() {
  const [state, setState] = React.useState({
    pump1: false,
    pump2: false,
    pump3: false,
  });

  // Fungsi untuk mengubah status pompa
  const handleChange = (event) => {
    const { name, checked } = event.target;

    // Set state lokal
    setState({
      ...state,
      [name]: checked,
    });

    // Update status pompa ke Firebase
    const pumpRef = ref(database, `Kontrol/${name}`);  // Path di Firebase, berdasarkan nama pompa (pump1, pump2, pump3)
    set(pumpRef, checked)  // Mengirimkan status 'true' atau 'false' ke Firebase
      .then(() => {
        console.log(`${name} status updated to ${checked}`);
      })
      .catch((error) => {
        console.error("Error updating pump status: ", error);
      });
  };

  // Gunakan useEffect untuk mendengarkan perubahan status pompa di Firebase
  React.useEffect(() => {
    const pumpsRef = ['pump1', 'pump2', 'pump3'];  // Nama pompa yang ingin dipantau
    pumpsRef.forEach((pump) => {
      const pumpRef = ref(database, `Kontrol/${pump}`);
      onValue(pumpRef, (snapshot) => {
        const status = snapshot.val();
        setState((prevState) => ({
          ...prevState,
          [pump]: status || false,  // Update status pompa dengan nilai yang ada di Firebase
        }));
      });
    });
  }, []);

  return (
    <FormControl component="fieldset" variant="standard" className="form-container">
      <FormLabel component="legend">Assign responsibility</FormLabel>
      <FormGroup className="switch-group">
        <FormControlLabel
          control={<Switch checked={state.pump1} onChange={handleChange} name="pump1" />}
          label="Pompa 1"
        />
        <FormControlLabel
          control={<Switch checked={state.pump2} onChange={handleChange} name="pump2" />}
          label="Pompa 2"
        />
        <FormControlLabel
          control={<Switch checked={state.pump3} onChange={handleChange} name="pump3" />}
          label="Pompa 3"
        />
      </FormGroup>
      <br />
      <Typography variant="h6">
        <CampaignIcon sx={{ color: red[500] }} /> Danger Alert
      </Typography>
      <Typography variant="body2">
        <span className='note-alert'>
          Dihimbau berhati-hati dalam menekan tombol berikut karena dapat menyalakan pompa secara <u><b>OTOMATIS</b></u>
        </span>
      </Typography>
    </FormControl>
  );
}

import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Typography,
  Box,
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import { red } from '@mui/material/colors';
import { ref, set, onValue } from "firebase/database";
import { database } from "./firebase-config";
import Switch from '@mui/material/Switch';

// CustomPumpSwitch - Styled switch component for pump toggle.
const CustomPumpSwitch = styled((props) => <Switch {...props} />)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        content: '"On"',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#4caf50',
        borderRadius: '50%',
        userSelect: 'none',
      },
      '& + .MuiSwitch-track': {
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#f44336',
    width: 32,
    height: 32,
    position: 'relative',
    '&:before': {
      content: '"Off"',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#f44336',
      borderRadius: '50%',
      userSelect: 'none',
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#8796A5',
    borderRadius: 10,
  },
}));

// ResponsiveParagraph - Styled component untuk paragraf responsif.
const ResponsiveParagraph = styled('p')(({ theme }) => ({
  fontSize: '1rem',
  lineHeight: 1.5,
  textAlign: 'justify',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    marginTop: '-4px',
  },
}));

// PumpButton - Functional component yang menampilkan toggle switch untuk pompa.
export default function PumpButton() {
  const [state, setState] = React.useState({
    pump1: false,
    pump2: false,
    pump3: false,
  });

  // handleChange - Handle toggle switch dan update Firebase.
  const handleChange = (event) => {
    const { name, checked } = event.target;
    setState((prev) => ({ ...prev, [name]: checked }));

    const pumpRef = ref(database, `Kontrol/${name}`);
    set(pumpRef, checked)
      .then(() => {
        console.log(`${name} status updated to ${checked}`);
      })
      .catch((error) => {
        console.error("Error updating pump status: ", error);
      });
  };

  // useEffect - Sinkronisasi status pompa dari Firebase.
  React.useEffect(() => {
    ['pump1', 'pump2', 'pump3'].forEach((pump) => {
      const pumpRef = ref(database, `Kontrol/${pump}`);
      onValue(pumpRef, (snapshot) => {
        const status = snapshot.val();
        setState((prev) => ({
          ...prev,
          [pump]: status || false,
        }));
      });
    });
  }, []);

  return (
    <FormControl component="fieldset" variant="standard" className="form-container">
      <FormLabel component="legend">Assign responsibility</FormLabel>
      <Box height={5} />
      <FormGroup className="switch-group">
        <FormControlLabel
          control={
            <CustomPumpSwitch
              checked={state.pump1}
              onChange={handleChange}
              name="pump1"
            />
          }
          label="Pompa 1"
        />
        <FormControlLabel
          control={
            <CustomPumpSwitch
              checked={state.pump2}
              onChange={handleChange}
              name="pump2"
            />
          }
          label="Pompa 2"
        />
        <FormControlLabel
          control={
            <CustomPumpSwitch
              checked={state.pump3}
              onChange={handleChange}
              name="pump3"
            />
          }
          label="Pompa 3"
        />
      </FormGroup>
      <br />
      <Typography variant="h6" sx={{ color: red[500], fontWeight: 'bold' }}>
        <CampaignIcon sx={{ color: red[500], marginRight: '5px' }} />
        Danger Alert
      </Typography>
      <Typography variant="body2">
        <span className='note-alert'>
          <ResponsiveParagraph>
              Dihimbau berhati-hati dalam menekan tombol berikut karena dapat menyalakan pompa secara <u><b>OTOMATIS</b></u>
          </ResponsiveParagraph>
        </span>
      </Typography>
    </FormControl>
  );
}

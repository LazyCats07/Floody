import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../appStore';
import './CSS/sideNav.css';
// import Typography from '@mui/material/Typography';



// ICONS
import dashboard from './icon/dashboard.gif';
import Report from './icon/Data.gif';
import settings from './icon/settings.gif';
import powerButton from './icon/power-button.gif';
import logout from './icon/logout.gif';

// Firebase
import { ref, set } from "firebase/database";
import { database } from "./firebase-config";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  })
);

// Reset Firebase control Logic
const resetFirebaseControl = () => {
  const controlRef = ref(database, 'Kontrol');

  set(controlRef, {
    PintuAir: 0,
    pump1: false,
    pump2: false,
    pump3: false,
  })
    .then(() => {
      console.log("Force shutdown complete, values reset.");
    })
    .catch((error) => {
      console.error("Error resetting Firebase values:", error);
    });
};

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);

  const menuItems = [
    { text: "Dashboard", icon: dashboard, onClick: () => navigate('/Home') },
    { text: "Data Laporan", icon: Report, onClick: () => navigate('/Report') },
    { text: "Sistem Kontrol", icon: settings, onClick: () => navigate('/Controller') },
    // { text: "Machine Learning", icon: settings, onClick: () => navigate('/MachineLearning') },
    { text: "Matikan Paksa", icon: powerButton, onClick: resetFirebaseControl },
    { text: "Logout", icon: logout, onClick: () => navigate('/Login') }
  ];

  return (
    <Box sx={{ display: 'flex', width: 240 }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        {/* Menu Items */}
        <List>
          {menuItems.map((item, index) => (

            <ListItem disablePadding sx={{ display: 'block', backgroundColor: 'transparent', fontWeight: 'bold' }} key={index} onClick={item.onClick}>
              <ListItemButton
                sx={{
                  minHeight: 50,
                  px: 2.5,
                  justifyContent: open ? 'initial' : 'center',
                }}
              >
              <div className="iconStyle">
                <img
                  src={item.icon}
                  alt={item.text}
                  className="icon"
                  style={{ width: '50px', marginBottom: '-10px', marginTop: '-20px', borderRadius: '35%' }}
                />
              </div>
              <ListItemText
                className='listTextSideNav'
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 600, fontSize: '15px', fontFamily: 'Poppins' }} 
                sx={{
                  opacity: open ? 1 : 0,
                  ml: 2,
                  mt: 2,
                }}
              />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* <Divider /> */}
      </Drawer>
    </Box>
  );
}

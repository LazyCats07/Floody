import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
// import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import WavesIcon from '@mui/icons-material/Waves';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../appStore';
import LogoutIcon from '@mui/icons-material/Logout';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { ref, set } from "firebase/database";
import { database } from "./firebase-config"; // Import your firebase config
import './CSS/sideNav.css';



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

  // Set the initial values for PintuAir and pumps
  set(controlRef, {
    PintuAir: 0,  // Resetting the PintuAir
    pump1: false, // Turning off pump1
    pump2: false, // Turning off pump2
    pump3: false, // Turning off pump3
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

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <Box height={100} />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        {/* <Divider />       */}

        {/* DASHBOARD SUB */}
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/Home')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* REPORT LINGKUNGAN POLDER */}
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/Report')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <WaterDropIcon />
              </ListItemIcon>
              <ListItemText
                primary="Report"
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Controller */}
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/Controller')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <OpenWithIcon />
              </ListItemIcon>
              <ListItemText
                primary="Controller"
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        
        {/* Force Shutdown */}
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={resetFirebaseControl}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <PowerSettingsNewIcon />
              </ListItemIcon>
              <ListItemText
                primary="Force Shutdown"
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Logout */}
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/Login')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
              <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />
      </Drawer>
    </Box>
  );
}

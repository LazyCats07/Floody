import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../appStore';
import './CSS/sideNav.css';

import dashboard from './icon/dashboard.gif';
import Report from './icon/Data.gif';
import settings from './icon/settings.gif';
import powerButton from './icon/power-button.gif';
import logout from './icon/logout.gif';

import { ref, set } from "firebase/database";
import { database } from "./firebase-config";

const drawerWidth = 240;

// openedMixin - Returns styles when the drawer is open.
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

// closedMixin - Returns styles when the drawer is closed.
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

// DrawerHeader - Styled component for the drawer header.
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Drawer - Custom styled Drawer component with dynamic open state.
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

// resetFirebaseControl - Resets control values in Firebase.
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

// Sidenav - Renders the side navigation menu.
export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);

  const menuItems = [
    { text: "Dashboard", icon: dashboard, onClick: () => navigate('/Home') },
    { text: "Data Laporan", icon: Report, onClick: () => navigate('/Report') },
    { text: "Sistem Kontrol", icon: settings, onClick: () => navigate('/Controller') },
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

        <List>
          {menuItems.map((item, index) => (
            <ListItem
              disablePadding
              sx={{ display: 'block', backgroundColor: 'transparent', fontWeight: 'bold' }}
              key={index}
              onClick={item.onClick}
            >
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
      </Drawer>
    </Box>
  );
}

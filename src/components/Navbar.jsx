import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Divider } from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useAppStore } from '../appStore';
import { useNavigate } from 'react-router-dom';
import logoFullcolor from './images/Log-Full-Color.png';
import './CSS/navbar.css';

import { auth } from './firebase-config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

// handleLogout - Performs logout operation.
async function handleLogout() {
  try {
    toast.success("User logged out successfully", { position: "top-center" });
    document.body.classList.add("fade-in-active");
    await auth.signOut();
    setTimeout(() => {
      window.location.href = "/Login";
    }, 1000);
  } catch (error) {
    console.log("Error logging out:", error.message);
  }
}

// fetchUserDetails - Fetches user details from Firestore.
async function fetchUserDetails(setUserDetails) {
  auth.onAuthStateChanged(async (user) => {
    setUserDetails(user);
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
      } else {
        console.log("User is not Logged in");
      }
    }
  });
}

// handleProfileMenuOpen - Opens the profile menu.
const handleProfileMenuOpen = (event, setAnchorEl) => {
  setAnchorEl(event.currentTarget);
};

// handleMobileMenuClose - Closes the mobile menu.
const handleMobileMenuClose = (setMobileMoreAnchorEl) => {
  setMobileMoreAnchorEl(null);
};

// handleMenuClose - Closes both the profile and mobile menus.
const handleMenuClose = (setAnchorEl, setMobileMoreAnchorEl) => {
  setAnchorEl(null);
  handleMobileMenuClose(setMobileMoreAnchorEl);
};

// handleMobileMenuOpen - Opens the mobile menu.
const handleMobileMenuOpen = (event, setMobileMoreAnchorEl) => {
  setMobileMoreAnchorEl(event.currentTarget);
};

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const [userDetails, setUserDetails] = useState(null);
  // Inisialisasi state dengan mengambil nilai dari localStorage
  const [isClicked, setIsClicked] = useState(() => {
    return localStorage.getItem('menuClicked') === 'true';
  });
  
  useEffect(() => {
    fetchUserDetails(setUserDetails);
  }, []);

  // handleMenuClick - Toggles the menu icon and persists state.
  const handleMenuClick = () => {
    const newState = !isClicked;
    setIsClicked(newState);
    updateOpen(!dopen);
    localStorage.setItem('menuClicked', newState.toString());
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={() => handleMenuClose(setAnchorEl, setMobileMoreAnchorEl)}
    >
      <div>
        <p style={{ padding: '1px 20px', fontSize: '18px', margin: ' -3px 0 2px 0' }}>
          Selamat datang <b>{userDetails?.firstName}</b>
        </p>
        <Divider />
      </div>
      <MenuItem onClick={() => navigate('/Home')}>Dashboard</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={() => handleMobileMenuClose(setMobileMoreAnchorEl)}
    >
      <MenuItem onClick={(e) => handleProfileMenuOpen(e, setAnchorEl)}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle sx={{ color: 'blue' }} />
        </IconButton>
        <p>Account</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: '#2f2f2f' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <Box sx={{ position: 'relative', width: 30, height: 24 }}>
              {/* Top bar */}
              <Box
                sx={{
                  position: 'absolute',
                  height: 3,
                  width: '100%',
                  backgroundColor: isClicked ? 'blue' : 'black',
                  top: 4,
                  transform: isClicked ? 'translateX(5px)' : 'translateX(0)',
                  transition: 'transform 0.4s ease, background-color 0.4s ease',
                }}
              />
              {/* Middle bar */}
              <Box
                sx={{
                  position: 'absolute',
                  height: 3,
                  width: '100%',
                  backgroundColor: isClicked ? 'blue' : 'black',
                  top: 10,
                  transform: isClicked ? 'translateX(10px)' : 'translateX(0)',
                  opacity: isClicked ? 0 : 1,
                  transition: 'transform 0.4s ease, opacity 0.4s ease',
                }}
              />
              {/* Bottom bar */}
              <Box
                sx={{
                  position: 'absolute',
                  height: 3,
                  width: '100%',
                  backgroundColor: isClicked ? 'blue' : 'black',
                  top: 16,
                  transform: isClicked ? 'translateX(10px)' : 'translateX(0)',
                  transition: 'transform 0.4s ease, background-color 0.4s ease',
                }}
              />
            </Box>
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={logoFullcolor}
              alt="Floody-Logo"
              className="logo hover"
              onClick={() => navigate('/Home')}
            />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={(e) => handleProfileMenuOpen(e, setAnchorEl)}
              color="inherit"
            >
              <AccountCircle sx={{ color: 'blue' }} />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={(e) => handleMobileMenuOpen(e, setMobileMoreAnchorEl)}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

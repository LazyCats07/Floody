import * as React from 'react';
import { useState, useEffect } from 'react';  // Import useState and useEffect hooks
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAppStore } from '../appStore';
import { useNavigate } from 'react-router-dom';
import logoFullcolor from './images/Log-Full-Color.png';
import './CSS/navbar.css';
import MoreIcon from '@mui/icons-material/MoreVert';

import { auth } from './firebase-config';  // Import Firebase auth
import { toast } from 'react-toastify';  // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toast styling
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import { Divider } from '@mui/material';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

// Navbar Component
export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen); // access the open state
  const [isClicked, setIsClicked] = useState(false); // Declare state for icon click effect

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Handle Logout function
async function handleLogout() {
    try {
        // Show the success toast
        toast.success("User logged out successfully", {
            position: "top-center",
        });

        // Add a class for the fade-in effect
        document.body.classList.add("fade-in-active"); // Trigger fade-in effect

        // Perform the logout
        await auth.signOut();

        // Delay the redirection to allow time for the fade-in effect
        setTimeout(() => {
            window.location.href = "/Login"; // Redirect after the effect
        }, 1000); // 1-second delay (or adjust based on your animation timing)

    } catch (error) {
        console.log("Error logging out:", error.message);
    }
}


  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details on mount
  const fetchUserDetails = async () => {
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
  };

  useEffect(() => {
      fetchUserDetails();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMenuClick = () => {
    setIsClicked(!isClicked); // Toggle clicked state for the icon
    updateOpen(!dopen); // Toggle sidebar open state
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <div>
        <p style={{paddingRight: '20px', paddingLeft: '20px', paddingTop: '1px', paddingBottom: '1px', fontSize: '18px', marginBottom: '2px', marginTop: '-3px' }}>Selamat datang <b>{userDetails?.firstName}</b></p>
        <Divider/>
      </div>
      <MenuItem onClick={() => navigate('/Home')}>Dashboard</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle sx={{ color: 'blue' }}/>
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
            <MenuIcon
              sx={{
                transition: 'transform 0.3s ease, color 0.3s ease',
                transform: isClicked ? 'rotate(90deg)' : 'rotate(0deg)',
                color: isClicked ? 'blue' : 'black',
              }}
            />
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
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle sx={{ color: 'blue' }}/>
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
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

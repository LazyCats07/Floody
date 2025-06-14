import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import CancelIcon from '@mui/icons-material/Cancel';
import { ref, onValue } from "firebase/database";
import { database } from "./firebase-config";

// handleClose - Closes a notification by filtering it out by id.
const handleClose = (id, setNotifications) => {
  setNotifications((prev) => prev.filter((n) => n.id !== id));
};

// addNotification - Adds a new notification and auto-removes it after 5 seconds.
const addNotification = (message, severity, type, icon = null, setNotifications) => {
  const id = new Date().getTime();
  setNotifications((prev) => [
    ...prev.filter((n) => n.type !== type),
    { id, message, severity, type, icon }
  ]);
  setTimeout(() => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, 5000);
};

// Notification - Functional component that listens to Firebase updates and displays notifications.
const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  // useEffect - Sets up Firebase listeners to get flood and pump status, then adds notifications.
  useEffect(() => {
    const statusBanjirRef = ref(database, 'Polder/status_banjir');
    onValue(statusBanjirRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Value banjir:", data, "type:", typeof data);
      if (data !== null) {
        let numericData;
        if (typeof data === 'object') {
          const keys = Object.keys(data);
          keys.sort();
          const latestKey = keys[keys.length - 1];
          numericData = Number(data[latestKey]);
        } else {
          numericData = Number(data);
        }
        if (isNaN(numericData)) {
          console.error("Banjir data is not numeric:", data);
          return;
        }
        console.log("Converted banjir data:", numericData);
        let message;
        let severity;
        let icon = null;
        if (numericData === 1) {
          message = 'Siaga 1: Waspada Banjir';
          severity = 'warning';
        } else if (numericData === 2) {
          message = 'Siaga 2: Banjir Meningkat';
          severity = 'warning';
        } else if (numericData === 3) {
          message = 'Siaga 3: Banjir Terjadi!';
          severity = 'error';
        } else {
          message = 'Kondisi Aman';
          severity = 'info';
        }
        addNotification(message, severity, 'flood', icon, setNotifications);
      }
    });

    const pumpStatusRef = ref(database, 'Polder/pump_on');
    onValue(pumpStatusRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Value pump:", data);
      if (data !== null) {
        let numericData;
        if (typeof data === 'object') {
          const keys = Object.keys(data);
          keys.sort();
          const latestKey = keys[keys.length - 1];
          numericData = Number(data[latestKey]);
        } else {
          numericData = Number(data);
        }
        console.log("Converted pump data:", numericData);
        let message = '';
        let severity = '';
        let icon = null;
        if (numericData === 1) {
          message = 'Aktifkan Pompa 1 segera';
          severity = 'warning';
        } else if (numericData === 2) {
          message = 'Aktifkan Pompa 2 segera';
          severity = 'warning';
        } else if (numericData === 3) {
          message = 'Aktifkan Pompa 3 segera';
          severity = 'warning';
        } else {
          message = 'Pompa sedang tidak aktif, kondisi stabil.';
          severity = 'success';
          icon = <CheckCircleIcon />;
        }
        addNotification(message, severity, 'pump', icon, setNotifications);
      }
    });
  }, []);

  // Return - Renders the notifications as Snackbars.
  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1300 }}>
      {notifications.map((notif, index) => (
        <Snackbar
          key={notif.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ marginTop: index * 70 }}
        >
          <Alert 
            severity={notif.severity} 
            icon={notif.icon}
            onClose={() => handleClose(notif.id, setNotifications)}
            action={null}
          >
            {notif.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

export default Notification;

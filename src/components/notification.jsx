import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import CancelIcon from '@mui/icons-material/Cancel';
import { ref, onValue } from "firebase/database";
import { database } from "./firebase-config";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  // Fungsi untuk menutup notifikasi secara manual
  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fungsi untuk menambah notifikasi baru
  const addNotification = (message, severity, type, icon = null) => {
    const id = new Date().getTime(); // Gunakan timestamp sebagai ID unik
    setNotifications((prev) => [
      // Hapus notifikasi yang sudah ada dengan kategori yang sama
      ...prev.filter((n) => n.type !== type),
      { id, message, severity, type, icon }
    ]);
    // Hapus notifikasi setelah 5 detik
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    // Firebase untuk status banjir
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
        // if (numericData === 0) {
        //   message = 'Banjir Tidak Terjadi';
        //   severity = 'success';
        //   icon = <CheckCircleIcon />;}
        // else if
        if(numericData === 1) {
          message = 'Siaga 1: Waspada Banjir';
          severity = 'warning';
        } else if (numericData === 2) {
          message = 'Siaga 2: Banjir Meningkat';
          severity = 'warning';
        } else if (numericData === 3) {
          message = 'Siaga 3: Banjir Terjadi!';
          severity = 'error';
        } 
        else {
          message = 'Kondisi Aman';
          severity = 'info';
        }
        addNotification(message, severity, 'flood', icon);
      }
    });

    // Firebase untuk status pompa
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
        // if (numericData === 0) {
        //   message = 'Pompa sedang tidak aktif, kondisi stabil.';
        //   severity = 'success';
        //   icon = <CheckCircleIcon />;
        if (numericData === 1) {
          message = 'Aktifkan Pompa 1 segera';
          severity = 'warning';
        } else if (numericData === 2) {
          message = 'Aktifkan Pompa 2 segera';
          severity = 'warning';
        } else if (numericData === 3) {
          message = 'Aktifkan Pompa 3 segera';
          severity = 'warning';
        } 
        else {
          message = 'Pompa sedang tidak aktif, kondisi stabil.';
          severity = 'success';
          icon = <CheckCircleIcon />;
        }
        addNotification(message, severity, 'pump', icon);
      }
    });
  }, []);

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
            onClose={() => handleClose(notif.id)}  // opsi silang untuk menutup notifikasi
            action={null} // gunakan default close icon
          >
            {notif.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

export default Notification;

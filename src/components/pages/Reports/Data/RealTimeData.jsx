// RealTimeData.jsx
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase-config";

export function RealTimeData(setters) {
  console.log("RealTimeData dipanggil");
  const dataRefs = {
    tmaSungai: ref(database, 'Polder/TMA_Sungai'),
    tmaKolam: ref(database, 'Polder/TMA_Kolam'),
    tmaHilir: ref(database, 'Polder/TMA_Hilir'),
    debitSungai: ref(database, 'Polder/Debit_Citarum'),
    debitKolam: ref(database, 'Polder/Debit_Cipalasari'),
    debitHilir: ref(database, 'Polder/Debit_Hilir'),
    curahHujanBS: ref(database, 'Polder/bojongsoang'),
    curahHujanDK: ref(database, 'Polder/dayeuhkolot'),
    pompa: ref(database, 'Polder/pump_on'),
    pintuAir: ref(database, 'Kontrol/PintuAir'), // Added this
    statusBanjir: ref(database, 'Polder/status_banjir') // Added this
  };

  Object.entries(dataRefs).forEach(([key, refPath]) => {
    onValue(refPath, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sortedKeys = Object.keys(data).sort();
        const lastKey = sortedKeys[sortedKeys.length - 1];
        const value = data[lastKey];

        console.log(`[${key}] Last Key: ${lastKey}, Value: ${value}`);

        if (setters[key]) setters[key](Number(value)); // Ensures it is numeric
      } else {
        console.warn(`[${key}] Data not found.`);
        if (setters[key]) setters[key](null);
      }
    });
  });
}

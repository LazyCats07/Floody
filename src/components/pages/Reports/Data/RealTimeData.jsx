// RealTimeData.jsx
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase-config";

export function RealTimeData(setters) {
  console.log("RealTimeData dipanggil");

  const dataRefs = {
    tmaCipalasari: ref(database, 'Polder/TMA_Cipalasari'),
    tmaKolam: ref(database, 'Polder/TMA_Kolam'),
    tmaCitarum: ref(database, 'Polder/TMA_Citarum'),
    debitHulu: ref(database, 'Polder/Debit_Hulu'),
    debitCipalasari: ref(database, 'Polder/Debit_Cipalasari'),
    debitHilir: ref(database, 'Polder/Debit_Hilir'),
    curahHujanBS: ref(database, 'Polder/bojongsoang'),
    curahHujanDK: ref(database, 'Polder/dayeuhkolot'),
    pompa: ref(database, 'Polder/pump_on'),
    pintuAir: ref(database, 'Kontrol/PintuAir'),
    statusBanjir: ref(database, 'Polder/status_banjir')
  };

  Object.entries(dataRefs).forEach(([key, refPath]) => {
    onValue(refPath, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sortedKeys = Object.keys(data).sort();
        const lastKey = sortedKeys[sortedKeys.length - 1];
        const value = data[lastKey];

        // Ensure the value is numeric
        const numericValue = !isNaN(value) ? parseFloat(value) : 0;

        console.log(`[${key}] Last Key: ${lastKey}, Value: ${numericValue}`);

        // Update the state with the parsed numeric value
        if (setters[key]) setters[key](numericValue);
      } else {
        console.warn(`[${key}] Data not found.`);
        if (setters[key]) setters[key](null); // Handle case when data is not found
      }
    });
  });
}

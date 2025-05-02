import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase-config";

export function RealTimeData(setters) {
  console.log("RealTimeData dipanggil");
  const dataRefs = {
    tmaSungai: ref(database, 'Polder/TMA_Sungai'),
    tmaKolam: ref(database, 'Polder/TMA_Kolam'),
    debitSungai: ref(database, 'Polder/Debit_Citarum'),
    debitKolam: ref(database, 'Polder/Debit_Cipalasari'),
    curahHujan: ref(database, 'Polder/Curah_Hujan'),
    pompa: ref(database, 'Polder/Status_Pompa'),
    tmaHilir: ref(database, 'Polder/TMA_Hilir'),
  };

  Object.entries(dataRefs).forEach(([key, refPath]) => {
    onValue(refPath, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const sortedKeys = Object.keys(data).sort(); // pastikan ambil data terbaru
        const lastKey = sortedKeys[sortedKeys.length - 1];
        const value = data[lastKey];

        console.log(`[${key}] Last Key: ${lastKey}, Value: ${value}`); // debug

        if (setters[key]) setters[key](Number(value)); // pastikan nilai angka
      } else {
        console.warn(`[${key}] Data tidak ditemukan.`);
        if (setters[key]) setters[key](null);
      }
    });
  });
}

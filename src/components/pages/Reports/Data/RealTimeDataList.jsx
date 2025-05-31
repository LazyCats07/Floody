import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase-config";

export function RealTimeDataList(setters) {
  console.log("RealTimeDataList dipanggil");

  const dataRefs = {
    curahHujanBS: ref(database, 'Polder/bojongsoang'),
    curahHujanDK: ref(database, 'Polder/dayeuhkolot'),
    debitCipalasari: ref(database, 'Polder/Debit_Cipalasari'),
    debitHulu: ref(database, 'Polder/Debit_Hulu'),
    debitHilir: ref(database, 'Polder/Debit_Hilir'),
    tmaCipalasari: ref(database, 'Polder/TMA_Cipalasari'),
    tmaKolam: ref(database, 'Polder/TMA_Kolam'),
    tmaCitarum: ref(database, 'Polder/TMA_Citarum'),
    statusPompa: ref(database, 'Polder/pump_on'),
  };

  Object.entries(dataRefs).forEach(([key, refPath]) => {
    onValue(refPath, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const formattedData = [];

        Object.entries(data).forEach(([timestamp, value]) => {
          // Ubah format timestamp agar kompatibel dan konsisten
          // Contoh: "2025-05-31-20_00_00" -> "2025-05-31 20:00:00"
          let cleanTimestamp = timestamp.replace(/-/g, ' ').replace(/_/g, ':');
          cleanTimestamp = cleanTimestamp.replace(/^(\d{4}) (\d{2}) (\d{2})/, '$1-$2-$3');

          const date = new Date(cleanTimestamp);

          if (!isNaN(date.getTime())) {
            // Format ke 'YYYY-MM-DD HH:mm:ss' dengan timezone Asia/Jakarta
            const formatted = date.toLocaleString('sv-SE', {
              timeZone: 'Asia/Jakarta',
              hour12: false,
            }).replace('T', ' ').split('.')[0];

            formattedData.push({
              timestamp: formatted,
              value: value,
            });
          } else {
            console.warn(`[${key}] Invalid timestamp: ${timestamp}`);
          }
        });

        // Urutkan descending berdasarkan timestamp
        formattedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (setters[key]) setters[key](formattedData);
      } else {
        console.warn(`[${key}] Data tidak ditemukan.`);
        if (setters[key]) setters[key]([]);  // Jangan set null, gunakan array kosong
      }
    });
  });
}

import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase-config";

// Fungsi RealTimeDataList untuk mengambil data real-time dari Firebase
export function RealTimeDataList(setters) {
  console.log("RealTimeDataList dipanggil");

  // Menggunakan ref untuk berbagai data yang diambil
  const dataRefs = {
    curahHujan: ref(database, 'Polder/Curah_Hujan'),
    debitCipalasari: ref(database, 'Polder/Debit_Cipalasari'),
    debitCitarum: ref(database, 'Polder/Debit_Citarum'),
    debitHilir: ref(database, 'Polder/Debit_Hilir'),
    tmaSungai: ref(database, 'Polder/TMA_Sungai'),
    tmaKolam: ref(database, 'Polder/TMA_Kolam'),
    tmaHilir: ref(database, 'Polder/TMA_Hilir'),
    statusPompa: ref(database, 'Polder/Status_Pompa'),
  };

  // Object untuk menampung data
  const allData = {};

  // Looping melalui dataRefs dan mendengarkan setiap perubahan nilai
  Object.entries(dataRefs).forEach(([key, refPath]) => {
    onValue(refPath, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = [];
        Object.entries(data).forEach(([timestamp, value]) => {
          console.log("Raw Timestamp:", timestamp);

          // Format timestamp
          const formattedTimestamp = timestamp.replace(/_/g, ':').replace(/-/g, '/');
          const date = new Date(formattedTimestamp);

          if (!isNaN(date.getTime())) {
            // Format timestamp sesuai kebutuhan
            const customTimestamp = date.toLocaleString('en-US', {
              timeZone: 'Asia/Jakarta', // Pastikan menggunakan timezone lokal Indonesia
              hour12: false,
            }).replace(/\//g, '-').replace(/,/g, '');

            formattedData.push({
              timestamp: customTimestamp, // Gunakan timestamp yang telah diformat
              value: value,
            });
          } else {
            console.warn(`[${key}] Invalid timestamp: ${formattedTimestamp}`);
          }
        });

        // Urutkan data berdasarkan timestamp
        formattedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        allData[key] = formattedData;
        if (setters[key]) setters[key](formattedData); // Update state komponen dengan data terbaru
      } else {
        console.warn(`[${key}] Data tidak ditemukan.`);
        if (setters[key]) setters[key](null);
      }
    });
  });
}

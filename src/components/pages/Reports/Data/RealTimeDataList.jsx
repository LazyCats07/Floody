import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase-config";

// Fungsi RealTimeDataList untuk mengambil data real-time dari Firebase
export function RealTimeDataList(setters) {
  console.log("RealTimeDataList dipanggil");

  // Menggunakan ref untuk berbagai data yang diambil
  const dataRefs = {
    // curahHujanBS: ref(database, 'Polder/Curah_HujanBS'),
    // curahHujanDK: ref(database, 'Polder/Curah_HujanDK'),
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
        
        // Loop through the data and format the timestamp correctly
        Object.entries(data).forEach(([timestamp, value]) => {
          console.log("Raw Timestamp:", timestamp);

          // Format timestamp to proper format
          const formattedTimestamp = timestamp.replace(/_/g, ':').replace(/-/g, '/');
          const date = new Date(formattedTimestamp);

          if (!isNaN(date.getTime())) {
            // If valid date, format to local Indonesia time zone
            const customTimestamp = date.toLocaleString('en-US', {
              timeZone: 'Asia/Jakarta', // Ensure using Indonesia local timezone
              hour12: false,
            }).replace(/\//g, '-').replace(/,/g, '');

            // Push formatted data to the array
            formattedData.push({
              timestamp: customTimestamp, // Use formatted timestamp
              value: value,
            });
          } else {
            console.warn(`[${key}] Invalid timestamp: ${formattedTimestamp}`);
          }
        });

        // Sort data by timestamp in descending order (latest first)
        formattedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Update the allData object and pass it to the setters for React state updates
        allData[key] = formattedData;

        // Update the state of the component with the formatted data
        if (setters[key]) setters[key](formattedData);
      } else {
        console.warn(`[${key}] Data tidak ditemukan.`);
        // Ensure setter is called even if no data is found (to handle null/undefined data)
        if (setters[key]) setters[key](null);
      }
    });
  });
}

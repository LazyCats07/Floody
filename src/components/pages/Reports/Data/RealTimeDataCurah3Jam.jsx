import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase-config";

export function RealTimeDataCurahByHour(setters, hoursAgo = 0) {
  const curahHujanRefs = {
    curahHujanBS: ref(database, 'Polder/bojongsoang'),
    curahHujanDK: ref(database, 'Polder/dayeuhkolot'),
  };

  Object.entries(curahHujanRefs).forEach(([key, refPath]) => {
    onValue(refPath, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = new Date();

        // Bulatkan waktu sekarang ke jam penuh (misal 20:05 -> 20:00)
        const currentHour = new Date(now);
        currentHour.setMinutes(0, 0, 0);

        // Hitung jam yang diinginkan berdasarkan parameter hoursAgo
        const targetHour = new Date(currentHour.getTime() - hoursAgo * 60 * 60 * 1000);

        const pad = (num) => num.toString().padStart(2, '0');

        const year = targetHour.getFullYear();
        const month = pad(targetHour.getMonth() + 1);
        const day = pad(targetHour.getDate());
        const hour = pad(targetHour.getHours());

        const keyToFind = `${year}-${month}-${day}-${hour}_00_00`;

        const filteredData = [];

        if (data.hasOwnProperty(keyToFind)) {
          filteredData.push({
            timestamp: keyToFind.replace(/-/g, ':').replace(/_/g, ':'),
            value: data[keyToFind],
          });
        }

        if (setters[key]) setters[key](filteredData);
      } else {
        if (setters[key]) setters[key](null);
      }
    });
  });
}

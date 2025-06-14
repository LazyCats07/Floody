import { ref, get } from "firebase/database";
import { database } from "../../../firebase-config";

// RealTimeDataCurahCurrentHour - Fungsi untuk mengambil data curah hujan jam saat ini (dibulatkan ke jam penuh) dari Firebase dan meng-update state melalui setters.
export async function RealTimeDataCurahCurrentHour(setters) {
  // curahHujanRefs - Objek referensi jalur data Firebase untuk curah hujan
  const curahHujanRefs = {
    curahHujanBS: 'Polder/bojongsoang',
    curahHujanDK: 'Polder/dayeuhkolot',
  };

  // pad - Fungsi untuk memformat angka menjadi string dengan 2 digit.
  const pad = (num) => num.toString().padStart(2, '0');

  const now = new Date();
  now.setMinutes(0, 0, 0); // Bulatkan ke jam penuh

  // Mendapatkan nilai tahun, bulan, hari, dan jam dalam format yang benar
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());

  // keyToFind - Kunci untuk mencari data dengan format "YYYY-MM-DD-HH_00_00"
  const keyToFind = `${year}-${month}-${day}-${hour}_00_00`;

  // Loop - Mengambil data untuk setiap jenis curah hujan dan meng-update state melalui setters
  for (const [key, path] of Object.entries(curahHujanRefs)) {
    const snapshot = await get(ref(database, path));
    const data = snapshot.val();

    let value = null;
    if (data && data.hasOwnProperty(keyToFind)) {
      value = data[keyToFind];
    }

    if (setters[key]) setters[key](value);
  }
}

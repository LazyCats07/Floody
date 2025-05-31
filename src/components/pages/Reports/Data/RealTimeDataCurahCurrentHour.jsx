import { ref, get } from "firebase/database";
import { database } from "../../../firebase-config";

export async function RealTimeDataCurahCurrentHour(setters) {
  const curahHujanRefs = {
    curahHujanBS: 'Polder/bojongsoang',
    curahHujanDK: 'Polder/dayeuhkolot',
  };

  const pad = (num) => num.toString().padStart(2, '0');

  const now = new Date();
  now.setMinutes(0, 0, 0); // bulatkan ke jam penuh

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());

  const keyToFind = `${year}-${month}-${day}-${hour}_00_00`;

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

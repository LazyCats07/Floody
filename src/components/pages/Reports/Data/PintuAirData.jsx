import { useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase-config";

// Custom hook to fetch and update PintuAir data
export function usePintuAirData(setPintuAir) {
  useEffect(() => {
    const pintuAirRef = ref(database, "Kontrol/PintuAir");

    onValue(pintuAirRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sortedKeys = Object.keys(data).sort(); 
        const lastKey = sortedKeys[sortedKeys.length - 1];
        const value = data[lastKey]; 

        console.log(`PintuAir Data: ${value}`);
        setPintuAir(value); 
      } else {
        console.warn("PintuAir data not found.");
        setPintuAir(null);
      }
    });
  }, [setPintuAir]);
}

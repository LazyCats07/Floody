import { toast } from 'react-toastify';

export function showFloodNotification(tma) {
  if (tma < 4) {
    toast.success('✅ Status: Aman (0) - Kondisi aman, terkontrol, terkendali.', {
      position: 'top-right',
      autoClose: 5000,
    });
  } else if (tma >= 4 && tma <= 8) {
    toast.warn('⚠️ Status: Siaga 1 - Air kolam sudah terindikasi akan menuju titik elevasi puncak.', {
      position: 'top-right',
      autoClose: 5000,
    });
  } else if (tma > 8.4 && tma <= 15.6) {
    toast.error('🚨 Status: Siaga 2 - Air kolam sudah mendekati titik elevasi puncak.', {
      position: 'top-right',
      autoClose: 5000,
    });
  } else if (tma > 16) {
    toast.error('🚨🔥 Status: Siaga 3 - Air kolam sangat mendekati atau melebihi elevasi puncak!', {
      position: 'top-right',
      autoClose: 5000,
    });
  } else {
    toast.info('ℹ️ Status tidak terdefinisi - Data TMA tidak valid.', {
      position: 'top-right',
      autoClose: 5000,
    });
  }
}

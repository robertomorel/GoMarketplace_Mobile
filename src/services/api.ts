import axios from 'axios';

/**
 * iOS com Emularor: localhost
 * iOS com físico: IP da máquina
 * Android com Emulador: localhost (adb reverse)
 * Android com Emulador: 10.0.2.2 (Android Studio)
 * Android com Emulador: 10.0.3.2 (Genymotion)
 * Android com físico: IP da máquina
 */

const api = axios.create({
  baseURL: 'http://10.0.2.2:3333',
});

export default api;

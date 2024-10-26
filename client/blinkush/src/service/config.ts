import { NetworkInfo } from "react-native-network-info";

const isProduction = process.env.NODE_ENV === 'production';

// Get the device's IP address
const getLocalIpAddress = async () => {
  return await NetworkInfo.getIPV4Address();
};

// Dynamically set BASE_URL and SOCKET_URL based on the environment
const initializeURLs = async () => {
  const BASE_IP = await getLocalIpAddress();
  const API_PORT = process.env.REACT_APP_API_PORT || 3000;
  const SOCKET_PORT = process.env.REACT_APP_SOCKET_PORT || 3000;

  const BASE_URL_DEV = `http://${BASE_IP}:${API_PORT}/api`;
  const SOCKET_URL_DEV = `http://${BASE_IP}:${SOCKET_PORT}`;

  return {
    BASE_URL: !isProduction ? 'http://192.168.132.243:3000/api' : BASE_URL_DEV,
    SOCKET_URL: !isProduction ? 'https://your-production-socket-url.com' : SOCKET_URL_DEV,
  };
};

// Exporting a promise that resolves with URLs
export const URLs = initializeURLs().then(urls => urls);

export const BASE_URL = URLs.then(urls => urls.BASE_URL);
export const SOCKET_URL = URLs.then(urls => urls.SOCKET_URL);


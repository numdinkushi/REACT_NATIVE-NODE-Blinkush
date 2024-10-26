import { NetworkInfo } from "react-native-network-info";

const isProduction = process.env.NODE_ENV === 'production';

let BASE_URL: string;
let SOCKET_URL: string;

// Get the device's IP address
const getLocalIpAddress = async (): Promise<string> => {

  return await NetworkInfo.getIPV4Address() as string;
};

// Dynamically set BASE_URL and SOCKET_URL based on the environment
const initializeURLs = async () => {
  const BASE_IP = await getLocalIpAddress();
  const API_PORT = process.env.REACT_APP_API_PORT || 3000;
  const SOCKET_PORT = process.env.REACT_APP_SOCKET_PORT || 3000;

  const APP_BASE_URL = `http://${BASE_IP}:${API_PORT}/api`;
  const APP_SOCKET_URL = `http://${BASE_IP}:${SOCKET_PORT}`;

  //note: remove the '!' and provide a proper production url
  BASE_URL = !isProduction ? `http://192.168.132.243:${API_PORT}/api` : APP_BASE_URL;
  SOCKET_URL = !isProduction ? 'https://your-production-socket-url.com' : APP_SOCKET_URL;

  // BASE_URL = isProduction ? APP_BASE_URL : `http://192.168.132.243:${API_PORT}/api`;
  // SOCKET_URL = isProduction ? APP_SOCKET_URL : 'https://your-production-socket-url.com';
};

export const initializeConfig = async () => {
  await initializeURLs(); // Ensure the URLs are initialized before app start
};

export const getBaseURL = () => BASE_URL;
export const getSocketURL = () => SOCKET_URL;


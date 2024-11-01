const isProduction = process.env.NODE_ENV === 'production';

let BASE_URL: string;
let SOCKET_URL: string;

const getServerIpAddress = async (): Promise<string> => {
  if (isProduction) {
    return 'your-production-server-ip'; 
  } else {
    // return '10.0.2.2' 
    return '192.168.77.243'; // Replace with your PC's IP (running server)
  }
};

// Dynamically set BASE_URL and SOCKET_URL based on the environment
const initializeURLs = async () => {
  const BASE_IP = await getServerIpAddress();
  const API_PORT = process.env.REACT_APP_API_PORT || 3000;
  const SOCKET_PORT = process.env.REACT_APP_SOCKET_PORT || 3000;

  const APP_BASE_URL = `http://${BASE_IP}:${API_PORT}/api`;
  const APP_SOCKET_URL = `http://${BASE_IP}:${SOCKET_PORT}`;

  console.log(2222, APP_BASE_URL)

  BASE_URL = !isProduction ? APP_BASE_URL : `https://your-production-api-url.com/api`;
  SOCKET_URL = !isProduction ? APP_SOCKET_URL : 'https://your-production-socket-url.com';
};

export const initializeConfig = async () => {
  await initializeURLs(); // Ensure the URLs are initialized before app start
};

export const getBaseURL = () => BASE_URL;
export const getSocketURL = () => SOCKET_URL;

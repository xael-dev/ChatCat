const fallbackApiBaseUrl = "http://localhost:8000";
const fallbackWsUrl = "ws://localhost:8000/ws/chat/general";

export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl,
  wsUrl: import.meta.env.VITE_WS_URL || fallbackWsUrl,
};

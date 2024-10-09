import { baseUrl } from "./constants";

export function createWebSocket(url) {
  return new WebSocket(baseUrl.replace("http", "ws") + url);
}

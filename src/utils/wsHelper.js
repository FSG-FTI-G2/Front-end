import { baseUrl } from "./constants";

/**
 * @param {string} url
 * @returns {WebSocket}
 */
export function createWebSocket(url) {
  return new WebSocket(baseUrl.replace("http", "ws") + url);
}

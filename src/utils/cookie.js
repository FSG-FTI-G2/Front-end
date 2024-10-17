import Cookies from "js-cookie";

/**
 * @param {string} key Cookie key
 * @param {string} value Cookie value
 * @param {object} options Cookie options
 */
export function setCookie(key, value, options) {
  Cookies.set(key, value, options);
}

/**
 * @param {string} key Cookie key
 * @returns {string} Cookie value
 */
export function getCookie(key) {
  return Cookies.get(key);
}

/**
 * @param {string} key Cookie key
 */
export function removeCookie(key) {
  Cookies.remove(key);
}

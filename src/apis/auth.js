import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import { removeCookie, setCookie } from "../utils/cookie";

/**
 * @template T
 * @callback onSuccess
 * @param {T} data
 * @returns {void}
 */

/**
 * @callback onFail
 * @param {string} message
 * @returns {void}
 */

/**
 * @param {string} username
 * @param {string} password
 * @param {onSuccess} onSuccess
 * @param {onFail} onFail
 */
export async function login({ username, password, onSuccess, onFail }) {
  // Create a FormData object
  const data = {
    username,
    password,
  };

  // Make a POST request to the login endpoint
  const response = await apiHelper.post(apiUrls.login, data, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });
  if (response.code === 200) {
    // Set the token in the cookie
    setCookie("token", response.data?.token);
    apiHelper.addToken(response.data?.token);
    onSuccess();
  } else {
    onFail(response.message);
  }
}

/**
 * @param {onSuccess} onSuccess
 * @param {onFail} onFail
 */
export async function getCurrentUser({ onSuccess, onFail }) {
  const response = await apiHelper.get(apiUrls.getCurrentUser);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

export async function logout() {
  removeCookie("token");
  apiHelper.removeToken();
}

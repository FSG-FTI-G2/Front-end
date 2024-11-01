import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import { removeCookie, setCookie } from "../utils/cookie";

/**
 * @async
 * @param {{
 * username: string;
 * password: string;
 * onSuccess: () => void;
 * onFail: (message: string) => void;
 * }} props
 */
export async function login({ username, password, onSuccess, onFail }) {
  // Create a FormData object
  const data = {
    username,
    password,
  };

  // Make a POST request to the login endpoint
  /** @type {ResponseData<{ token: string }>} */
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
 * @async
 * @param {{
 * onSuccess: (data: UserData) => void;
 * onFail: (message: string) => void;
 * }} props
 */
export async function getCurrentUser({ onSuccess, onFail }) {
  /** @type {ResponseData<UserData>} */
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
  window.location.href = "/login";
}
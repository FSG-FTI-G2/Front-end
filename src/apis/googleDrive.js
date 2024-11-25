import axios from "axios";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";
import {
  fileAcceptance,
  googleClientToken,
  googleDrivePermission,
} from "../utils/constants";

/**
 * @param {{
 * onSuccess: (tokenData: GoogleAuthToken) => void,
 * onFail: (message: string) => void
 * }} props
 */
export const googleAuthenticator = ({ onSuccess, onFail }) => {
  // Raise error if google oauth script is not loaded
  if (!window.google?.accounts?.oauth2) {
    onFail("Google Service Identification script is not loaded");
    return;
  }
  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: googleClientToken,
    scope: googleDrivePermission,
    callback: (tokenResponse) => {
      if (tokenResponse.error) {
        onFail(tokenResponse.error);
      } else {
        onSuccess(tokenResponse);
      }
    },
  });
  client.requestAccessToken();
};

/**
 * @return {string | undefined} The Google OAuth2 Access Token
 */
export const getGoogleAccessToken = () => {
  return getCookie("gtoken");
};

/**
 * @param {string} token The Google OAuth2 Access Token
 * @returns {void}
 */
export const setGoogleAccessToken = (token) => {
  setCookie("gtoken", token);
};

/**
 * @returns {void}
 */
export const removeGoogleAccessToken = () => {
  removeCookie("gtoken");
};

/**
 * @param {{
 * accessToken: string,
 * onSuccess: (userInfo: GoogleUserData) => void,
 * onFail: (message: string) => void
 * }} props
 */
export const getGoogleUserInfo = async ({ accessToken, onSuccess, onFail }) => {
  try {
    /** @type {import("axios").AxiosResponse<GoogleUserData>} */
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "json",
      }
    );
    onSuccess(response.data);
  } catch (error) {
    onFail(error.message);
  }
};

/**
 * @param {{
 * pickedDocs: GoogleDrivePickerData,
 * accessToken: string,
 * onSuccess: (files: File[]) => void,
 * onFail: (message: string) => void
 * }} props
 * @returns
 */
export const downloadFilesFromDrive = async ({
  pickedDocs,
  accessToken,
  onSuccess,
  onFail,
}) => {
  /** @type {File[]} */
  const files = [];
  /** @type {Error[]} */
  const errorFiles = [];
  if (!pickedDocs.docs?.length) {
    onFail("No files selected or found");
    return;
  }
  // Check files type
  /** @type {GoogleDrivePickerDoc[]} */
  const allowDocs = [];
  for (const doc of pickedDocs.docs) {
    const allowList = fileAcceptance.split(",");
    if (!allowList.includes(doc.mimeType)) {
      onFail(`File type ${doc.mimeType} is not allowed`);
    } else {
      allowDocs.push(doc);
    }
  }

  // Download files
  for (const doc of allowDocs) {
    const fileId = doc.id;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          responseType: "blob",
        }
      );
      files.push(new File([response.data], doc.name, { type: doc.mimeType }));
    } catch (error) {
      errorFiles.push(error);
    }
  }
  if (errorFiles.length) {
    onFail(`Failed to download ${errorFiles.length} files`);
  } else {
    onSuccess(files);
  }
};

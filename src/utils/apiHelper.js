import axios from "axios";
import { baseUrl } from "./constants";
import { getCookie } from "./cookie";

// Type definitions
/**
 * @template T
 * @typedef {Object} ResponseData
 * @property {string} code - The status of the response.
 * @property {string} message - The message of the response.
 * @property {T|null} data - The data returned in the response.
 * @property {Object|null} error - The error message, if any.
 * @property {number} timestamp - The timestamp of the response.
 */

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${getCookie("token")}`,
    "Content-Type": "application/json",
  },
});

const apiHelper = {
  /**
   * @param {string} token Token to be added to the request header
   */
  addToken: (token) => {
    api.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  },

  /**
   * @param {string} token Token to be removed from the request header
   */
  removeToken: () => {
    api.interceptors.request.use((config) => {
      delete config.headers.Authorization;
      return config;
    });
  },

  /**
   * @param {string} url URL to make the request
   * @param {object} params Query parameters to be sent with the
   * @returns {Promise<ResponseData<T>>} The response data
   */
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("🐞 Error: ", error);
      return error.response.data;
    }
  },

  /**
   * @param {string} url URL to make the request
   * @param {Object} data Object to be sent in the request body
   * @param {Object} config Additional configurations for the request
   * @returns {Promise<ResponseData<T>>} The response data
   */
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, {
        ...config,
        headers: { "Content-Type": "application/json", ...config.headers },
      });
      return response.data;
    } catch (error) {
      console.error("🐞 Error: ", error);
      return error.response.data;
    }
  },

  /**
   * @param {string} url URL to make the request
   * @param {FormData} formData FormData object to be sent in the request body
   * @param {Object} config Additional configurations for the request
   * @returns {Promise<ResponseData<T>>} The response data
   */
  postFormData: async (url, formData, config = {}) => {
    try {
      const response = await api.post(url, formData, {
        ...config,
        headers: { "Content-Type": "multipart/form-data", ...config.headers },
      });
      return response.data;
    } catch (error) {
      console.error("🐞 Error: ", error);
      return error.response.data;
    }
  },

  /**
   * @param {string} url URL to make the request
   * @param {Object} data Object to be sent in the request body
   * @param {Object} config Additional configurations for the request
   * @returns {Promise<ResponseData<T>>} The response data
   */
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, {
        ...config,
        headers: { "Content-Type": "application/json", ...config.headers },
      });
      return response.data;
    } catch (error) {
      console.error("🐞 Error: ", error);
      return error.response.data;
    }
  },

  /**
   * @param {string} url URL to make the request
   * @param {Object} config Additional configurations for the request
   * @returns {Promise<ResponseData<T>>} The response data
   */
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, { ...config });
      return response.data;
    } catch (error) {
      console.error("🐞 Error: ", error);
      return error.response.data;
    }
  },
};

export default apiHelper;

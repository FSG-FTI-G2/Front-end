import axios from "axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { baseUrl } from "./constants";
import { getCookie } from "./cookie";

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
   * @param {object} data Object to be sent in the request body
   * @param {object} config Additional configurations for the request
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
   * @param {object} config Additional configurations for the request
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
   * @param {object} data Object to be sent in the request body
   * @param {object} config Additional configurations for the request
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
   * @param {object} config Additional configurations for the request
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

  /**
   * @param {string} url URL to make the request
   * @param {object} data Object to be sent in the request body
   * @param {object} config Additional configurations for the request
   * @param {{
   * onOpen?: (response: Response) => void,
   * onMessage?: (message: import("@microsoft/fetch-event-source").EventSourceMessage) => void,
   * onClose?: () => void,
   * onError?: (error: any) => void
   * }} handlers
   */
  stream: async (url, data, handlers, config = {}) => {
    await fetchEventSource(`${baseUrl}${url}`, {
      method: data ? "POST" : "GET",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...config.headers,
      },
      onopen: handlers.onOpen,
      onmessage: handlers.onMessage,
      onerror: handlers.onError,
      onclose: handlers.onClose,
    });
  },
};

export default apiHelper;

import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import { createWebSocket } from "../utils/wsHelper";

/**
 * @typedef ProgressData
 * @param {boolean} isComplete
 * @param {number} uploadPercentage
 * @param {Object} status
 */

/**
 * @param {Object} progressData
 * @returns {ProgressData}
 */
function parseProgressObject(progressData) {
  return {
    isComplete: progressData.is_completed || false,
    uploadPercentage: progressData.upload_percentage || 100,
    status: progressData.status || {},
  };
}

/**
 * @param {File} file
 * @param {(data: ProgressData) => void} onProgress
 * @param {() => void} onSuccess
 * @param {(msg: String) => void} onFail
 */
export async function uploadFiles({ files, onProgress, onSuccess, onFail }) {
  // Define form data
  const data = new FormData();
  // Add files to form data
  files.forEach((file) => {
    data.append("files", file);
  });
  // Make a POST request to the uploadFile endpoint
  const response = await apiHelper.postFormData(apiUrls.uploadFile, data, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(parseProgressObject({ upload_percentage: percentCompleted }));
    },
  });
  // Check if the response is successful
  if (response.code !== 200) {
    onFail(response.message);
    return;
  }
  // Open WebSocket connection to get the progress of the file
  const progressId = response.data.progress_id;
  const ws = createWebSocket(apiUrls.uploadFile + progressId);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.data.is_completed) {
      onSuccess(parseProgressObject(data.data));
      ws.close();
    } else {
      onProgress(parseProgressObject(data.data));
    }
  };
}

export async function getFiles({
  pageSize,
  pageIndex,
  search,
  fileType,
  status,
  onSuccess,
  onFail,
}) {
  const params = {
    page_size: pageSize || 10,
    page_index: pageIndex || 0,
    search: search || null,
    file_type: fileType || null,
    status: status || null,
  };
  const response = await apiHelper.get(apiUrls.getFiles, params);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

export async function deleteFile({ id, onSuccess, onFail }) {
  const response = await apiHelper.delete(apiUrls.deleteFile + id);
  if (response.code === 200) {
    onSuccess(response.message);
  } else {
    onFail(response.message);
  }
}

import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import { createWebSocket } from "../utils/wsHelper";

/**
 * @param {ProgressDataRaw} progressData
 * @returns {ProgressData}
 */
function parseProgressObject(progressData) {
  return {
    isCompleted: progressData.is_completed || false,
    uploadPercentage: progressData.upload_percentage || 100,
    status: progressData.status || {},
  };
}

/**
 * @async
 * @param {{
 * files: File[],
 * onProgress: (data: ProgressData) => void,
 * onSuccess: (data: ProgressData) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function uploadFiles({ files, onProgress, onSuccess, onFail }) {
  // Define form data
  const data = new FormData();
  // Add files to form data
  files.forEach((file) => {
    data.append("files", file);
  });
  // Make a POST request to the uploadFile endpoint
  /** @type {ResponseData<{ progress_id: string }>} */
  const response = await apiHelper.postFormData(apiUrls.files, data, {
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
  const ws = createWebSocket(apiUrls.files + progressId);
  ws.onmessage = (event) => {
    /** @type {ResponseData<ProgressDataRaw>} */
    const data = JSON.parse(event.data);
    if (data.data.is_completed) {
      onSuccess(parseProgressObject(data.data));
      ws.close();
    } else {
      onProgress(parseProgressObject(data.data));
    }
  };
}

/**
 * @async
 * @param {{
 * pageSize: number,
 * pageIndex: number,
 * search: string,
 * fileType: string,
 * status: string,
 * onSuccess: (data: PaginationData<FileData>) => void,
 * onFail: (message: string) => void
 * }} props
 */
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
  /** @type {ResponseData<PaginationData<FileData>} */
  const response = await apiHelper.get(apiUrls.files, params);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

/**
 * @param {{
 * id: string,
 * onSuccess: (message: string) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function deleteFile({ id, onSuccess, onFail }) {
  const response = await apiHelper.delete(apiUrls.files + id);
  if (response.code === 200) {
    onSuccess(response.message);
  } else {
    onFail(response.message);
  }
}

/**
 * @param {{
 * id: string,
 * onSuccess: (data: FileData) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function getFileById({ id, onSuccess, onFail }) {
  /** @type {ResponseData<FileData>} */
  const response = await apiHelper.get(apiUrls.files + id);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

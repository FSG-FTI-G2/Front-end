import fileVisualPdf from "../assets/images/fileVisualImagePdf.png";
import fileVisualDocx from "../assets/images/fileVisualImageDocx.png";
import fileVisualTxt from "../assets/images/fileVisualImageTxt.png";
import { appColors, baseUrl } from "./constants";

/**
 * @param {string} fileType
 * @returns {string}
 */
export function getColorByFileType(fileType) {
  if (fileType === "pdf") {
    return appColors.pdfIndicator;
  } else if (fileType === "docx") {
    return appColors.docsIndicator;
  } else {
    return appColors.grey;
  }
}

/**
 * @param {string} fileType
 * @returns {string}
 */
export function getBgColorByFileType(fileType) {
  if (fileType === "pdf") {
    return appColors.pdfBackground;
  } else if (fileType === "docx") {
    return appColors.docsBackground;
  } else {
    return appColors.lightGrey;
  }
}

/**
 * @param {string} fileType
 * @returns {string}
 */
export function getFailureVisualImageByFileType(fileType) {
  if (fileType === "pdf") {
    return fileVisualPdf;
  } else if (fileType === "docx") {
    return fileVisualDocx;
  } else {
    return fileVisualTxt;
  }
}

/**
 * @param {string} status
 * @returns {string}
 */
export function getColorByStatus(status) {
  if (status === "error") {
    return appColors.statusError;
  } else if (status === "uploading") {
    return appColors.statusUploading;
  } else if (status === "processing") {
    return appColors.statusProcessing;
  } else if (status === "success") {
    return appColors.statusSuccess;
  } else {
    return appColors.statusPending;
  }
}

/**
 * @param {string} dateString
 * @param {boolean} dateOnly
 * @returns {string}
 */
export function formatDateString(dateString, dateOnly = true) {
  const date = new Date(dateString);
  const options = dateOnly
    ? { year: "numeric", month: "long", day: "numeric" }
    : {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
  return date.toLocaleDateString("en-US", options);
}

/**
 * @param {string} fileName
 * @param {number} limit
 * @returns {string}
 */
export function formatLongFileName(fileName, limit = 15) {
  return fileName.length > limit ? `${fileName.slice(0, limit)}...` : fileName;
}

/**
 * @param {string} file
 * @returns {string}
 */
export function getFileStaticPath(file) {
  return `${baseUrl}/static/${file}`;
}

/**
 * @param {string} url
 * @param {boolean} byteData
 * @returns {Promise<string | Blob | null>}
 */
export async function getUrlContent(url, byteData = false) {
  const response = await fetch(url);
  if (response.ok) {
    return byteData ? response.blob() : response.text();
  }
  return null;
}

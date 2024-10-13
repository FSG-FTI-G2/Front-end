import fileVisualPdf from "../assets/images/fileVisualImagePdf.png";
import fileVisualDocx from "../assets/images/fileVisualImageDocx.png";
import fileVisualTxt from "../assets/images/fileVisualImageTxt.png";
import { appColors, baseUrl } from "./constants";

export function getColorByFileType(fileType) {
  if (fileType === "pdf") {
    return appColors.pdfIndicator;
  } else if (fileType === "docx") {
    return appColors.docsIndicator;
  } else {
    return appColors.grey;
  }
}

export function getBgColorByFileType(fileType) {
  if (fileType === "pdf") {
    return appColors.pdfBackground;
  } else if (fileType === "docx") {
    return appColors.docsBackground;
  } else {
    return appColors.lightGrey;
  }
}

export function getFailureVisualImageByFileType(fileType) {
  if (fileType === "pdf") {
    return fileVisualPdf;
  } else if (fileType === "docx") {
    return fileVisualDocx;
  } else {
    return fileVisualTxt;
  }
}

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

export function formatLongFileName(fileName, limit = 15) {
  return fileName.length > limit ? `${fileName.slice(0, limit)}...` : fileName;
}

export function getFileStaticPath(file) {
  return `${baseUrl}/static/${file}`;
}

export async function getUrlContent(url, byteData = false) {
  const response = await fetch(url);
  if (response.ok) {
    return byteData ? response.blob() : response.text();
  }
  return null;
}

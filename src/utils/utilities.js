import fileVisualPdf from "../assets/images/fileVisualImagePdf.png";
import fileVisualDocx from "../assets/images/fileVisualImageDocx.png";
import fileVisualTxt from "../assets/images/fileVisualImageTxt.png";
import { appColors } from "./constants";

export function concatFileName(fileName) {
  return `${fileName.slice(0, 15)}${fileName.length > 15 ? "..." : ""}`;
}

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

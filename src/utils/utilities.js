export function concatFileName(fileName) {
  return `${fileName.slice(0, 15)}${fileName.length > 15 ? "..." : ""}`;
}

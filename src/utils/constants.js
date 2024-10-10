// Localhost URL
export const baseUrl = "http://localhost:8000";

export const apiUrls = {
  login: "/api/v1/auth/login",
  getCurrentUser: "/api/v1/auth/me",
  uploadFile: "/api/v1/files/",
};

export const appColors = {
  // Base color
  backBackground: "#F5F7F8",
  background: "#FFFFFF",
  darkGrey: "#ADB5BD",
  grey: "#CED4DA",
  lightGrey: "#F1F3F5",
  white: "#FFFFFF",

  // File colors
  pdfIndicator: "#C7253E",
  pdfBackground: "#F6EFEF",
  docsIndicator: "#4379F2",
  docsBackground: "#E1E7F5",

  // Status
  statusPending: "#F5F5F7",
  statusUploading: "#FCCD2A",
  statusProcessing: "#4379F2",
  statusSuccess: "#347928",
  statusError: "#C7253E",
};

export const fileAcceptance =
  "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

export const gridBreakpoints = {
  xs: "600px",
  sm: "768px",
  md: "1024px",
  lg: "1400px",
  xl: "1920px",
};

export const gridSpan = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 4,
  xl: 3,
};

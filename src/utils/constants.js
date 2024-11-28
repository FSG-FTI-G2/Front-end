// Localhost URL
export const baseUrl = "http://localhost:7860";

export const googleClientToken =
  "966252714987-i9g0mr72tf7c1ae051o221heagbiegc4.apps.googleusercontent.com";

export const googleDrivePermission =
  "https://www.googleapis.com/auth/drive.file";

export const drivePickerConfig = {
  clientId: googleClientToken,
  developerKey: "AIzaSyAhj80NKqZRTeQOwHjKyXT3BSdwYZZ2UL0",
  scope: googleDrivePermission,
  viewId: "DOCS",
  multiselect: true,
};

export const apiUrls = {
  login: "/api/v1/auth/login",
  getCurrentUser: "/api/v1/auth/me",
  files: "/api/v1/files/",
  llm: "/api/v1/llm/",
  chat: "/api/v1/chat/",
  feedback: "/api/v1/feedback/",
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

export const LLMModelOptions = [
  { label: "OpenAI", value: "openai" },
  { label: "Azure OpenAI", value: "azure_openai" },
  { label: "Gemini", value: "google_gemini" },
  { label: "Ollama", value: "ollama" },
];

export const SelectRolePromptOptions = [
  { label: "Student", value: "student" },
  { label: "Expert", value: "expert" },
];

export const ExamplePrompts = [
  "Summarize my documents",
  "What is my document topics",
  "Something in my document",
  "Can you help me with my document",
];

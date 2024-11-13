// API Responses
interface ResponseData<T> {
  code: number;
  message: string;
  data: T | null;
  error: Object | null;
  timestamp: number;
}

interface PaginationData<T> {
  data: T[];
  page_index: number;
  page_size: number;
  total_pages: number;
}

// User Object
interface UserData {
  id: string;
  username: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Upload File Progress Format
interface ProgressDataRaw {
  is_completed: boolean;
  upload_percentage: number | undefined;
  status: Record<string, string>;
}

interface ProgressData {
  isCompleted: boolean;
  uploadPercentage: number;
  status: object;
}

// File Object
interface FileData {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  type: string;
  status: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

interface DisplayedFile {
  id: number | string;
  fileName: string;
  fileType: string;
  uploadedDate: string;
  status: string;
}

// LLM Config Object
interface ModelConfig {
  name_model: string;
  api_key?: string;
  endpoint?: string;
}

interface LLMConfigData {
  id: string;
  user_id: string;
  selected_model?: string;
  config: Record<string, ModelConfig>;
  created_at: string;
  updated_at: string;
}

// Chat Object

interface MessageData {
  type: string;
  content: string;
}

interface ChatData {
  id: string;
  user_id: string;
  title: string;
  messages: MessageData[];
  role_prompt: string;
}

interface GoogleUserData {
  id : string;
  email : string;
  picture : string;
  verified_email : boolean
}
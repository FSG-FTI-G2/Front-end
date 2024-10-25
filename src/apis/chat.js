import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

/**
 * @param {{
 * onSuccess: (data: ChatData[]) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function getChats({ onSuccess, onFail }) {
  /** @type {ResponseData<ChatData[]>} */
  const response = await apiHelper.get(apiUrls.chat);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

/**
 * @param {{
 * messageId: string,
 * onSuccess: (data: MessageData[]) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function getChatMessageById({ messageId, onSuccess, onFail }) {
  /** @type {ResponseData<MessageData[]>} */
  const response = await apiHelper.get(apiUrls.chat + messageId);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

/**
 * @param {{
 * message: string,
 * messageId?: string,
 * role?: string,
 * onSuccess: (data: ChatData) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function sendChatMessage({
  message,
  messageId,
  role,
  onSuccess,
  onFail,
}) {
  const data = {
    message,
    message_id: messageId || null,
    role: role || null,
  };
  /** @type {ResponseData<ChatData>} */
  const response = await apiHelper.post(apiUrls.chat, data);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

/**
 * @param {{
 * messageId: string,
 * onSuccess: () => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function deleteChatMessage({ messageId, onSuccess, onFail }) {
  const response = await apiHelper.delete(apiUrls.chat + messageId);
  if (response.code === 200) {
    onSuccess();
  } else {
    onFail(response.message);
  }
}

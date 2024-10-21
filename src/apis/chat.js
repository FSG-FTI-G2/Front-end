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

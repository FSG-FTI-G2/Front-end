import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

/**
 * @param {{
 * onSuccess: (data: LLMConfigData) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function getLLMConfig({ onSuccess, onFail }) {
  /** @type {ResponseData<LLMConfigData>} */
  const response = await apiHelper.get(apiUrls.llm);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

/**
 * @param {{
 * selectedModel: string,
 * config: ModelConfig,
 * onSuccess: (data: LLMConfigData) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function updateLLMConfig({
  selectedModel,
  config,
  onSuccess,
  onFail,
}) {
  console.log(config);
  /** @type {ResponseData<LLMConfigData>} */
  const response = await apiHelper.post(apiUrls.llm, config, {
    params: { selected_model: selectedModel },
  });
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

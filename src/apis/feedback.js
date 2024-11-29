import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

/**
 * @param {{
 * pageSize: number,
 * pageIndex: number,
 * search: string,
 * evaluationStatus: string[],
 * sortBy: string,
 * onSuccess: (data: PaginationData<FeedbackData>) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function getFeedback({
  pageSize,
  pageIndex,
  search,
  evaluationStatus,
  sortBy,
  onSuccess,
  onFail,
}) {
  const params = {
    page_size: pageSize || 10,
    page_index: pageIndex || 0,
    search: search || null,
    evaluation_status: evaluationStatus.join(",") || null,
    sort_by: sortBy || null,
  };
  /** @type {ResponseData<PaginationData<FeedbackData>} */
  const response = await apiHelper.get(apiUrls.feedback, params);
  if (response.code === 200) {
    onSuccess(response.data);
  } else {
    onFail(response.message);
  }
}

/**
 * @param {{
 * feedbackIds: string[],
 * evaluationStatus: number,
 * onSuccess: (message: string) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function updateFeedbackStatus({
  feedbackIds,
  evaluationStatus,
  onSuccess,
  onFail,
}) {
  const body = {
    feedback_records_id: feedbackIds,
    evaluation: evaluationStatus,
  };
  const response = await apiHelper.post(apiUrls.feedback, body);
  if (response.code === 200) {
    onSuccess(response.message);
  } else {
    onFail(response.message);
  }
}

/**
 * @param {{
 * feedbackIds: string[],
 * onSuccess: (message: string) => void,
 * onFail: (message: string) => void
 * }} props
 */
export async function deleteFeedback({ feedbackIds, onSuccess, onFail }) {
  const body = {
    feedback_records_id: feedbackIds,
  };
  const response = await apiHelper.put(apiUrls.feedback, body);
  if (response.code === 200) {
    onSuccess(response.message);
  } else {
    onFail(response.message);
  }
}

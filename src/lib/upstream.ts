import axios from 'axios';

export const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';
export const CLIENT_ID = process.env.PW_CLIENT_ID || 'system-admin';
export const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
export const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || 'KjPXuAVfC5xbmgreETNMaL7z';

function buildHeaders(additional: Record<string, any> = {}) {
  const headers: any = {
    'client-id': CLIENT_ID,
    org: ORG,
    'client-type': 'WEB',
    ...additional,
  };
  if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;
  return headers;
}

export async function callUpstream(method: 'get'|'post'|'put'|'delete', path: string, { params, data, headers }: { params?: any; data?: any; headers?: any } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}/${path.replace(/^\/+/, '')}`;
  const opts: any = { method, url, headers: buildHeaders(headers || {}), timeout: 10000 };
  if (params) opts.params = params;
  if (data) opts.data = data;
  const res = await axios.request(opts);
  return res.data;
}

export const ENDPOINTS = {
  GET_BATCH_DETAILS: (id: string) => `v3/batches/${id}/details`,
  GET_BATCH_CONFIG: (id: string) => `v3/batch-service/batch-config/${id}`,
  GET_BATCH_LECTURES: (id: string, slug: string) => `v1/batches/${id}/subject/${slug}/schedule`,
  GET_TOPIC_LIST: (id: string, subId: string) => `batch-service/v1/batch-tags/${id}/subject/${subId}/topics`,
  GET_CONTENT_LIST: (id: string, subId: string) => `batch-service/v3/batch-subject-schedules/${id}/subject/${subId}/contents`,
  GET_TODAYS_SCHEDULE: (id: string) => `v1/batches/${id}/todays-schedule`,
  GET_WEEKLY_SCHEDULE: (id: string) => `v2/batches/${id}/weekly-schedules`,
  GET_SCHEDULE_DETAILS: (id: string, sId: string, sl: string) => `v1/batches/${id}/subject/${sl}/schedule/${sId}/schedule-details`,
  FETCH_STATS: () => `v3/video-stats/fetch-stats`,
  SAVE_STATS: () => `v3/video-stats/save-stats`,
  REGISTER_SESSION: () => `uxncc-be-go/video-stats/v1/register-session`,
  SYNC_STATS: () => `uxncc-be-go/video-stats/v1/sync-stats`,
  LECTURE_STATUS: () => `uxncc-be-go/video-stats/v1/lecture/status`,
};

export default { callUpstream, ENDPOINTS };

import { ENDPOINTS } from '../constants/config';
import { request } from './http';

/** @returns {Promise<{ worker_count: number, order_count: number, average_rating: number }>} */
export const getSystemStats = () => request(ENDPOINTS.SYSTEM_STATS, { auth: false });

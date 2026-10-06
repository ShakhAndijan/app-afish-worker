import { ENDPOINTS } from '../constants/config';
import { request } from './http';

export const getCategories = async () =>
  (await request(ENDPOINTS.CATEGORIES, { timeout: 10000 })) ?? [];

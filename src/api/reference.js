import { ENDPOINTS } from '../constants/config';
import { request } from './http';

const getList = async (url) => (await request(url, { timeout: 10000 })) ?? [];

export const getGenders = () => getList(ENDPOINTS.GENDERS);
export const getRegions = () => getList(ENDPOINTS.REGIONS);
export const getDistricts = (regionId) => getList(ENDPOINTS.DISTRICTS(regionId));
export const getLanguages = () => getList(ENDPOINTS.LANGUAGES);
export const getPriceTypes = () => getList(ENDPOINTS.PRICE_TYPES);

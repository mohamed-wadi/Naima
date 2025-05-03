// Service wrapper to handle both mock and API services
import * as mockService from './mockTraysService';
import * as apiService from './apiTraysService';

// Determine if we should use the API or mock service
// In production, always use the API
// In development, use the environment variable or default to mock
const useApi = process.env.NODE_ENV === 'production' || 
               process.env.REACT_APP_USE_API === 'true';

// Export the appropriate functions based on the environment
export const getAllTrays = useApi ? apiService.getAllTrays : mockService.getAllTrays;
export const getActiveTrays = useApi ? apiService.getActiveTrays : mockService.getActiveTrays;
export const addTray = useApi ? apiService.addTray : mockService.addTray;
export const removeTray = useApi ? apiService.removeTray : mockService.removeTray;
export const getTrayById = useApi ? apiService.getTrayById : mockService.getTrayById;
export const updateTray = useApi ? apiService.updateTray : mockService.updateTray;
export const deleteTray = useApi ? apiService.deleteTray : mockService.deleteTray;

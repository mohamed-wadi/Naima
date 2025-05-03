// API service for trays that connects to the backend API
import axios from 'axios';

// Base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all trays
export const getAllTrays = async () => {
  try {
    const response = await api.get('/trays');
    return response.data;
  } catch (error) {
    console.error('Error fetching all trays:', error);
    throw error;
  }
};

// Get active trays (not removed)
export const getActiveTrays = async () => {
  try {
    const response = await api.get('/trays/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active trays:', error);
    throw error;
  }
};

// Add a new tray
export const addTray = async (trayData) => {
  try {
    const response = await api.post('/trays', trayData);
    return response.data;
  } catch (error) {
    console.error('Error adding tray:', error);
    throw error;
  }
};

// Mark a tray as removed
export const removeTray = async (id) => {
  try {
    const response = await api.patch(`/trays/${id}/remove`);
    return response.data;
  } catch (error) {
    console.error('Error removing tray:', error);
    throw error;
  }
};

// Get a specific tray
export const getTrayById = async (id) => {
  try {
    const response = await api.get(`/trays/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tray by id:', error);
    throw error;
  }
};

// Update a tray
export const updateTray = async (id, updates) => {
  try {
    const response = await api.patch(`/trays/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating tray:', error);
    throw error;
  }
};

// Delete a tray
export const deleteTray = async (id) => {
  try {
    const response = await api.delete(`/trays/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tray:', error);
    throw error;
  }
};

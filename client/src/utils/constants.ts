export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api/';

export const constants = {
  BASE_URL,
  LOCAL_STORAGE_TOKEN: 'token',
  LOCAL_STORAGE_USER: 'user',
};

export const GOOGLE_SHEET_LINK='https://docs.google.com/spreadsheets/d/1iapUjPkoSrHXFAhv1hoCwAEYpUkP21eIqZUXcPWRXSc/export?format=xlsx'

export const apiUrl = {
  // chatbot: 'qa/'
  register: 'auth/register',
  login: 'auth/login',
  profile: 'auth/profile',
  dashboard: 'auth/dashboard',
  changePassword: 'auth/change-password',
  batchListing: 'salary/batches',
  removeBatch: 'salary/salary-data',
  processSlips: 'process/generate-and-send',
  excelUpload: 'salary/upload'
}
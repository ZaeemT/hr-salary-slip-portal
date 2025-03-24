export const BASE_URL = 'http://127.0.0.1:5000/api/';  // Replace with your API base URL

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
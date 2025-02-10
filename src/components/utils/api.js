// src/apiClient.js (or wherever your API client is defined)
import axios from 'axios';
import { BASE_URL } from './config';  // Import the BASE_URL from config

const apiClient = axios.create({
    baseURL: BASE_URL,  // Use the imported BASE_URL
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error.response || error.message);
    }
);

export const deleteRequest = async (url) => {
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        throw error; // This will be caught in the component where deleteRequest is called
    }
};

/**
 * Generic GET request
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - Query parameters (optional)
 */
export const get = (endpoint, params) =>
    apiClient.get(endpoint, { params });

/**
 * Generic POST request
 * @param {string} endpoint 
 * @param {Object} data - The data to send in the request body
 */

/**
 * Generic POST request
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send in the request body
 */
// export const postProduct = async (endpoint, data) => {
//     try {
//         const response = await apiClient.post(endpoint, data);
//         return response.data; // Return the response data directly
//     } catch (error) {
//         console.error('Error with POST request:', error.response || error.message);
//         throw error; // Rethrow the error so the caller can handle it
//     }
// };




export const post = (endpoint, data) =>
    apiClient.post(endpoint, data);

/**
 * Generic PUT request
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send in the request body
 */
export const put = (endpoint, data) =>
    apiClient.put(endpoint, data);

/**
 * Generic DELETE request
 * @param {string} endpoint - The API endpoint
 */
export const del = (endpoint) =>
    apiClient.delete(endpoint);

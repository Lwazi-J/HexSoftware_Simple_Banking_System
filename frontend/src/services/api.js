import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/bank';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data || config.params);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const bankAPI = {
  // Customer operations
  createCustomer: (firstName, lastName, email) => {
    const params = new URLSearchParams();
    params.append('firstName', firstName);
    params.append('lastName', lastName);
    params.append('email', email);

    return api.post('/customers', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  // Account operations
  createAccount: (customerId, accountNumber) => {
    const params = new URLSearchParams();
    params.append('customerId', customerId);
    params.append('accountNumber', accountNumber);

    return api.post('/accounts', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  // Transaction operations
  deposit: (accountId, amount) => {
    const params = new URLSearchParams();
    params.append('amount', amount);

    return api.post(`/accounts/${accountId}/deposit`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  withdraw: (accountId, amount) => {
    const params = new URLSearchParams();
    params.append('amount', amount);

    return api.post(`/accounts/${accountId}/withdraw`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  // Query operations
  getBalance: (accountId) => {
    return api.get(`/accounts/${accountId}/balance`);
  },

  getCustomerAccounts: (customerId) => {
    return api.get(`/customers/${customerId}/accounts`);
  },
};

export default api;
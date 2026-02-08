import API from './api';

export const expenseService = {
  getAll: async () => {
    const { data } = await API.get('/expenses');
    return data;
  },

  getById: async (id) => {
    const { data } = await API.get(`/expenses/${id}`);
    return data;
  },

  create: async (expenseData) => {
    const { data } = await API.post('/expenses', expenseData);
    return data;
  },

  update: async (id, expenseData) => {
    const { data } = await API.put(`/expenses/${id}`, expenseData);
    return data;
  },

  delete: async (id) => {
    const { data } = await API.delete(`/expenses/${id}`);
    return data;
  },

  getMonthlyReport: async (year, month) => {
    const { data } = await API.get(
      `/expenses/reports/monthly?year=${year}&month=${month}`
    );
    return data;
  },

  getCategorySummary: async () => {
    const { data } = await API.get('/expenses/reports/category-summary');
    return data;
  },

  getByRange: async (startDate, endDate) => {
    const { data } = await API.get(
      `/expenses/range?startDate=${startDate}&endDate=${endDate}`
    );
    return data;
  },
};
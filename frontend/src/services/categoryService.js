import API from './api';

export const categoryService = {
  getAll: async () => {
    const { data } = await API.get('/categories');
    return data;
  },

  create: async (categoryData) => {
    const { data } = await API.post('/categories', categoryData);
    return data;
  },
};
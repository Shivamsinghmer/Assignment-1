// JSONPlaceholder API endpoint configurations
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const endpoints = {
  posts: {
    list: () => `${BASE_URL}/posts`,
    single: (id) => `${BASE_URL}/posts/${id}`
  },
  users: {
    single: (id) => `${BASE_URL}/users/${id}`
  }
};

export default endpoints;

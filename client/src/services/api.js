import axios from 'axios';

import { port } from '../port.json';

const api = axios.create({
  baseURL: `http://localhost:${port}/`
});

export default api;
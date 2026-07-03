import axios from 'axios';

// Flask reads repeated keys: size=5-marla&size=10-marla
// Axios default bracket notation (size[]=...) breaks Flask's getlist(),
// so we serialize arrays as repeated plain keys.
function paramsSerializer(params) {
  const parts = [];
  Object.entries(params).forEach(([key, val]) => {
    if (val === undefined || val === null || val === '') return;
    if (Array.isArray(val)) {
      val.forEach(v => { if (v !== '' && v !== undefined) parts.push(`${key}=${encodeURIComponent(v)}`); });
    } else {
      parts.push(`${key}=${encodeURIComponent(val)}`);
    }
  });
  return parts.join('&');
}

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  paramsSerializer,
});

export default api;

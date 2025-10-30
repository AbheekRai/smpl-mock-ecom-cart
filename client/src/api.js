import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const getProducts = () => axios.get(`${API_BASE}/products`).then(r=>r.data);
export const getCart = () => axios.get(`${API_BASE}/cart`).then(r=>r.data);
export const addToCart = (productId, qty=1) => axios.post(`${API_BASE}/cart`, { productId, qty }).then(r=>r.data);
export const removeFromCart = (id) => axios.delete(`${API_BASE}/cart/${id}`).then(r=>r.data);
export const updateCartItem = (id, qty) => axios.patch(`${API_BASE}/cart/${id}`, { qty }).then(r=>r.data);
export const checkout = (payload) => axios.post(`${API_BASE}/checkout`, payload).then(r=>r.data);

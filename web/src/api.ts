import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useStore } from './store';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api/v1';

export const apiClient = axios.create({ baseURL: API_BASE });

apiClient.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export async function loginApi(username: string, password: string) {
  const res = await apiClient.post('/auth/login', { username, password });
  return res.data as { access_token: string; token_type: string; user: import('./types').User };
}

// Hooks
export const useEpochs = () => useQuery({ queryKey: ['epochs'], queryFn: () => apiClient.get('/epochs').then(r => r.data) });
export const useDashboard = () => useQuery({ queryKey: ['dashboard'], queryFn: () => apiClient.get('/m5/dashboard').then(r => r.data) });
export const useAlerts = () => useQuery({ queryKey: ['alerts'], queryFn: () => apiClient.get('/m5/alerts').then(r => r.data) });
export const useRecommendations = () => useQuery({ queryKey: ['recommendations'], queryFn: () => apiClient.get('/m5/recommendations').then(r => r.data) });
export const useStockpiles = () => useQuery({ queryKey: ['stockpiles'], queryFn: () => apiClient.get('/m2/stockpiles').then(r => r.data) });
export const useStockpile = (id: string) => useQuery({ queryKey: ['stockpile', id], queryFn: () => apiClient.get(`/m2/stockpiles/${id}`).then(r => r.data), enabled: !!id });
export const useUnits = () => useQuery({ queryKey: ['units'], queryFn: () => apiClient.get('/m4/units').then(r => r.data), refetchInterval: 5000 });
export const useFleetKpi = () => useQuery({ queryKey: ['fleetkpi'], queryFn: () => apiClient.get('/m4/fleet/kpi').then(r => r.data) });
export const useSlopes = () => useQuery({ queryKey: ['slopes'], queryFn: () => apiClient.get('/m7/slopes').then(r => r.data) });
export const useLandDashboard = () => useQuery({ queryKey: ['land'], queryFn: () => apiClient.get('/m8/land/dashboard').then(r => r.data) });
export const useDatasets = () => useQuery({ queryKey: ['datasets'], queryFn: () => apiClient.get('/m6/datasets').then(r => r.data) });
export const useConnectors = () => useQuery({ queryKey: ['connectors'], queryFn: () => apiClient.get('/m6/connectors').then(r => r.data) });
export const usePitDesigns = () => useQuery({ queryKey: ['pitdesigns'], queryFn: () => apiClient.get('/m3/pit-designs').then(r => r.data) });
export const useLayers = () => useQuery({ queryKey: ['layers'], queryFn: () => apiClient.get('/m1/layers').then(r => r.data) });

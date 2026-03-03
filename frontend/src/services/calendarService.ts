import api from './api';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export interface CalendarStatus {
  connected: boolean;
  connected_at: string | null;
}

export interface CalendarConnectResponse {
  message: string;
}

export interface CalendarDisconnectResponse {
  message: string;
}

export const calendarService = {
  getStatus: async (): Promise<CalendarStatus> => {
    const response = await api.get<CalendarStatus>('/users/calendar/status/');
    return response.data;
  },

   connect: (userId: string): void => {
    window.location.href = `${apiBaseUrl}users/calendar/authorize/?user_id=${userId}`;
  },

  disconnect: async (): Promise<CalendarDisconnectResponse> => {
    const response = await api.delete<CalendarDisconnectResponse>('/users/calendar/disconnect/');
    return response.data;
  },

  checkAuthCallback: (): boolean => {
    const params = new URLSearchParams(window.location.search);
    return params.get('calendar_connected') === 'true';
  },

  clearAuthCallback: (): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete('calendar_connected');
    window.history.replaceState({}, '', url.toString());
  },

  getReturnUrl: (): string | null => {
    return sessionStorage.getItem('calendar_return_url');
  },

  clearReturnUrl: (): void => {
    sessionStorage.removeItem('calendar_return_url');
  },
};

export default calendarService;
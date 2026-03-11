import api from './api';
import type { PaginatedPayouts, PayoutQueryParams, PayoutSummaryItem, Payout } from '../@types/payout.types';

export const getPayouts = async (params?: PayoutQueryParams): Promise<PaginatedPayouts> => {
  try {
    const response = await api.get<PaginatedPayouts>('/payments/payouts/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching payouts:', error);
    throw error;
  }
};

export const getPendingPayoutsCount = async (): Promise<number> => {
  try {
    const response = await getPayouts({ status: 'PENDING' });
    return response.count;
  } catch (error) {
    console.error('Error fetching pending payouts count:', error);
    return 0;
  }
};

export const getPayoutSummary = async (): Promise<PayoutSummaryItem[]> => {
  try {
    const response = await api.get<PayoutSummaryItem[]>('/payments/payouts/summary/');
    return response.data;
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    return [];
  }
};

export const getPayoutById = async (id: string): Promise<Payout> => {
  try {
    const response = await api.get<Payout>(`/payments/payouts/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payout by ID:', error);
    throw error;
  }
};
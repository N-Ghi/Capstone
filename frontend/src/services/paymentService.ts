import api from './api';
import type { Payment, PaymentPayRequest } from '../@types/payment.types';


export const submitPayment = async (paymentId: string, data: PaymentPayRequest): Promise<Payment> => {
  try {
    const response = await api.post<Payment>(`/payments/${paymentId}/pay/`, data);
    return response.data;
  } catch (error) {
    console.error('Error submitting payment:', error);
    throw error;
  }
};

export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  try {
    const response = await api.get<Payment>(`/payments/${paymentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};
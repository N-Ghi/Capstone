export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'Mobile Money' | 'Credit Card' | 'Debit Card';
export type MobileProvider = 'MTN Mobile Money' | 'Airtel Money';

export interface Payment {
  id: string;
  booking: string;
  amount: number;
  payment_method: PaymentMethod;
  provider?: MobileProvider;
  provider_payment_id?: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface PaymentInitiateResponse {
  id: string;
  booking: string;
  amount: number;
  payment_status: PaymentStatus;
}

export interface PaymentPayRequest {
  method_id: string;
  provider_id?: string;
  number: string;
}
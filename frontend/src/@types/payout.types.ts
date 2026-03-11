import type { PaginatedResponse } from './experience.types';

export type PayoutStatusCode = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';

export interface Payout {
  id: string;
  guide: string;
  booking: string;
  amount: string;
  payout_date: string;
  status: string;
  status_detail: { id: string; code: PayoutStatusCode } | null;
  account_name: string | null;
  guide_profile : {
    phone_number : string;
    payout_provider : {
      id: string;
      name: string;
    }
  }
  provider_payout_id: string;
  booking_detail: {
    experience_title: string;
    slot_date: string;
    slot_start_time: string;
    slot_end_time: string;
    total_price: string;
    platform_fee: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface PayoutQueryParams {
  status?: string;
  booking?: string;
}

export interface PayoutSummaryItem {
  status__code: PayoutStatusCode;
  total: string;
  count: number;
}

export type PaginatedPayouts = PaginatedResponse<Payout>;
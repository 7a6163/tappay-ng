/**
 * TapPay SDK Types
 */

export class TapPayConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TapPayConfigError';
  }
}

export interface TapPayConfig {
  partnerId: string;
  partnerKey: string;
  merchantId?: string;
  merchantGroupId?: string;
  env?: 'sandbox' | 'production';
}

export type Currency = 'TWD' | 'USD' | 'JPY';

export interface Cardholder {
  phone_number: string;
  name: string;
  email: string;
  zip_code?: string;
  address?: string;
  national_id?: string;
  member_id?: string;
}

export interface PayByPrimeRequest {
  prime: string;
  partner_key: string;
  merchant_id?: string;
  merchant_group_id?: string;
  details: string;
  amount: number;
  currency?: Currency;
  cardholder: Cardholder;
  remember?: boolean;
  order_number?: string;
  bank_transaction_id?: string;
  frontend_redirect_url?: string;
  backend_notify_url?: string;
  three_domain_secure?: boolean;
  result_url?: {
    frontend_redirect_url: string;
    backend_notify_url: string;
  };
  instalment?: number;
  delay_capture_in_days?: number;
}

export interface CardInfo {
  bin_code: string;
  last_four: string;
  issuer: string;
  funding: number;
  type: number;
  level: string;
  country: string;
  country_code: string;
}

export interface CardSecret {
  card_key: string;
  card_token: string;
}

export interface PayByPrimeResponse {
  status: number;
  msg: string;
  amount: number;
  currency: Currency;
  rec_trade_id: string;
  bank_transaction_id: string;
  order_number?: string;
  auth_code: string;
  card_info: CardInfo;
  card_secret?: CardSecret;
  payment_url?: string;
  transaction_time_millis: number;
  bank_transaction_time?: {
    start_time_millis: string;
    end_time_millis: string;
  };
  bank_result_code?: string;
  bank_result_msg?: string;
  acquirer: string;
}

export interface PayByCardTokenRequest {
  card_key: string;
  card_token: string;
  partner_key: string;
  merchant_id?: string;
  merchant_group_id?: string;
  amount: number;
  currency?: Currency;
  details: string;
  cardholder: Cardholder;
  order_number?: string;
  bank_transaction_id?: string;
  backend_notify_url?: string;
  three_domain_secure?: boolean;
  result_url?: {
    frontend_redirect_url: string;
    backend_notify_url: string;
  };
  instalment?: number;
}

export interface PayByCardTokenResponse {
  status: number;
  msg: string;
  amount: number;
  currency: Currency;
  rec_trade_id: string;
  bank_transaction_id: string;
  order_number?: string;
  auth_code: string;
  card_info: CardInfo;
  payment_url?: string;
  transaction_time_millis: number;
  bank_transaction_time?: {
    start_time_millis: string;
    end_time_millis: string;
  };
  acquirer: string;
}

export interface RefundRequest {
  partner_key: string;
  rec_trade_id: string;
  amount?: number;
}

export interface RefundResponse {
  status: number;
  msg: string;
  rec_trade_id: string;
  refund_amount: number;
  is_capture: boolean;
}

export interface RecordFilter {
  records_per_page?: number;
  page?: number;
  time?: {
    start_time: number;
    end_time: number;
  };
  amount?: {
    lower_limit: number;
    upper_limit: number;
  };
  cardholder?: {
    phone_number?: string;
    name?: string;
    email?: string;
  };
  merchant_id?: string;
  currency?: Currency;
  order_number?: string;
  rec_trade_id?: string;
}

export interface RecordRequest {
  partner_key: string;
  filters?: RecordFilter;
}

export interface TradeRecord {
  rec_trade_id: string;
  amount: number;
  currency: Currency;
  record_status: number;
  order_number?: string;
  bank_transaction_id: string;
  transaction_time_millis: number;
  bank_transaction_time: {
    start_time_millis: string;
    end_time_millis: string;
  };
  card_info: CardInfo;
  cardholder: Cardholder;
  bank_result_code: string;
  bank_result_msg: string;
  auth_code: string;
  merchant_id: string;
  acquirer: string;
}

export interface RecordResponse {
  status: number;
  msg: string;
  number_of_transactions: number;
  trade_records: TradeRecord[];
}

export interface TapPayError {
  status: number;
  msg: string;
}

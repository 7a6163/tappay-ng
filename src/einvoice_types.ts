/**
 * TapPay E-Invoice Types
 * Based on 電子發票 Open API 規格 商戶 V1.4
 */

/** 發票通知方式：AUTO 為自動寄送，MANU 為手動寄送 */
export type NotifyEmail = 'AUTO' | 'MANU';

/**
 * 電子發票稅額種類
 * - `1` 一般稅額 (default)
 * - `2` 特種稅額
 *
 * @note 預計 2025/6 月起必填且支援檢核
 */
export type InvoiceType = 1 | 2;

/**
 * 載具類型
 * - `0` 會員載具 (default)
 * - `1` 手機條碼載具
 * - `2` 自然人憑證載具
 */
export type CarrierType = 0 | 1 | 2;

/**
 * 品項課稅別
 * - `1` 應稅
 * - `2` 零稅率
 * - `3` 免稅
 */
export type TaxType = 1 | 2 | 3;

export type PaymentType = 'CREDIT_CARD' | 'E_WALLET';

export type EInvoiceCurrency = 'TWD';

export type CustomsClearanceMarkEnum = 1 | 2;

export interface EInvoiceConfig {
  partnerKey: string;
  env?: 'sandbox' | 'production';
}

// Issue Invoice

export interface EInvoiceDetail {
  sequence_id: string;
  sub_amount: number;
  unit_price: number;
  quantity: number;
  description: string;
  tax_type: TaxType;
}

export interface EInvoiceCarrier {
  type: CarrierType;
  number?: string;
}

export interface EInvoiceIssueRequest {
  partner_key: string;
  order_number: string;
  order_date: string;
  seller_name?: string;
  seller_identifier?: string;
  buyer_identifier?: string;
  buyer_name?: string;
  buyer_email: string;
  buyer_cell_phone?: string;
  buyer_address?: string;
  issue_notify_email?: NotifyEmail;
  invoice_type?: InvoiceType;
  currency: EInvoiceCurrency;
  total_amount: number;
  details: EInvoiceDetail[];
  tax_rate?: number;
  tax_amount: number;
  sales_amount?: number;
  zero_tax_sales_amount?: number;
  customs_clearance_mark_enum?: CustomsClearanceMarkEnum;
  free_tax_sales_amount?: number;
  payment_type?: PaymentType;
  carrier?: EInvoiceCarrier;
  npoban?: string;
  invoice_number?: string;
  notify_url: string;
  remark?: string;
}

export interface EInvoiceIssueResponse {
  status: number;
  msg: string;
  invoice_result_error_code?: string;
  invoice_result_msg?: string;
  rec_invoice_id?: string;
  order_number?: string;
  invoice_issue_order_number?: string;
  invoice_number?: string;
  invoice_date?: string;
  invoice_time?: string;
}

// Void Invoice

export interface EInvoiceVoidRequest {
  partner_key: string;
  rec_invoice_id: string;
  invoice_number: string;
  void_order_id: string;
  void_reason: string;
  void_notify_email?: NotifyEmail;
}

export interface EInvoiceVoidResponse {
  status: number;
  msg: string;
  invoice_result_error_code?: string;
  invoice_result_msg?: string;
  invoice_void_order_number?: string;
  invoice_number?: string;
  void_date?: string;
  void_time?: string;
}

// Void with Reissue

export interface EInvoiceVoidWithReissueRequest {
  partner_key: string;
  rec_invoice_id: string;
  reissue_order_id: string;
  reissue_reason: string;
}

export interface EInvoiceVoidWithReissueResponse {
  status: number;
  msg: string;
  invoice_result_error_code?: string;
  invoice_result_msg?: string;
  invoice_reissue_order_number?: string;
  invoice_number?: string;
  reissue_date?: string;
  reissue_time?: string;
}

// Allowance

export interface EInvoiceAllowanceDetail {
  sequence_id: string;
  sub_amount: number;
  unit_price: number;
  quantity: number;
  description?: string;
  tax_type: TaxType;
  tax_amount: number;
}

export interface EInvoiceAllowanceRequest {
  partner_key: string;
  rec_invoice_id: string;
  allowance_number?: string;
  allowance_notify_email?: NotifyEmail;
  details: EInvoiceAllowanceDetail[];
  allowance_amount: number;
  allowance_reason: string;
  allowance_sale_amount: number;
  allowance_tax_amount: number;
}

export interface EInvoiceAllowanceResponse {
  status: number;
  msg: string;
  invoice_result_error_code?: string;
  invoice_result_msg?: string;
  invoice_allowance_order_number?: string;
  allowance_number?: string;
  invoice_number?: string;
  remain_amount?: number;
  allowance_date?: string;
  allowance_time?: string;
}

// Query Invoice

export interface EInvoiceQueryRequest {
  partner_key: string;
  rec_invoice_id: string;
}

export interface EInvoiceQuerySellerInfo {
  identifier: string;
}

export interface EInvoiceQueryBuyerInfo {
  identifier?: string;
  email?: string;
  notify_type?: NotifyEmail;
}

export interface EInvoiceQueryResponse {
  status: number;
  msg: string;
  invoice_result_error_code?: string;
  invoice_result_msg?: string;
  rec_invoice_id?: string;
  invoice_status?: string;
  invoice_number?: string;
  seller_info?: EInvoiceQuerySellerInfo;
  buyer_info?: EInvoiceQueryBuyerInfo;
  currency?: EInvoiceCurrency;
  tax_amount?: number;
  sales_amount?: number;
  zero_tax_sales_amount?: number;
  free_tax_sales_amount?: number;
  total_amount?: number;
  payment_type?: string;
  carrier?: EInvoiceCarrier;
  npoban?: string;
  remark?: string;
}

// Query Allowance

export interface EInvoiceQueryAllowanceRequest {
  partner_key: string;
  rec_invoice_id: string;
  allowance_number: string;
}

export interface EInvoiceQueryAllowanceResponse {
  status: number;
  msg: string;
  invoice_result_error_code?: string;
  invoice_result_msg?: string;
  rec_invoice_id?: string;
  allowance_number?: string;
  invoice_number?: string;
  allowance_amount?: number;
  allowance_sale_amount?: number;
  allowance_tax_amount?: number;
  allowance_date?: string;
  allowance_time?: string;
  details?: EInvoiceAllowanceDetail[];
}

export interface EInvoiceError {
  status: number;
  msg: string;
}

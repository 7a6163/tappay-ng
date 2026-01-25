import * as https from 'https';
import {
  TapPayConfig,
  TapPayConfigError,
  PayByPrimeRequest,
  PayByPrimeResponse,
  PayByCardTokenRequest,
  PayByCardTokenResponse,
  RefundRequest,
  RefundResponse,
  RecordRequest,
  RecordResponse,
  TapPayError,
  Cardholder,
  Currency,
} from './types';

const SANDBOX_BASE_URL = 'sandbox.tappaysdk.com';
const PRODUCTION_BASE_URL = 'prod.tappaysdk.com';

export class TapPayClient {
  private partnerId: string;
  private partnerKey: string;
  private merchantId?: string;
  private merchantGroupId?: string;
  private baseUrl: string;

  constructor(config: TapPayConfig) {
    const hasMerchantId = config.merchantId !== undefined && config.merchantId !== '';
    const hasMerchantGroupId = config.merchantGroupId !== undefined && config.merchantGroupId !== '';

    if (!hasMerchantId && !hasMerchantGroupId) {
      throw new TapPayConfigError('Either merchantId or merchantGroupId must be provided');
    }

    if (hasMerchantId && hasMerchantGroupId) {
      throw new TapPayConfigError('merchantId and merchantGroupId cannot be used together');
    }

    this.partnerId = config.partnerId;
    this.partnerKey = config.partnerKey;
    this.merchantId = config.merchantId;
    this.merchantGroupId = config.merchantGroupId;
    this.baseUrl =
      config.env === 'production' ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;
  }

  private request<T>(
    path: string,
    data: any
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);

      const options: https.RequestOptions = {
        hostname: this.baseUrl,
        port: 443,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'x-api-key': this.partnerKey,
        },
      };

      const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(body);

            if (response.status !== 0) {
              const error: TapPayError = {
                status: response.status,
                msg: response.msg || 'Unknown error',
              };
              reject(error);
            } else {
              resolve(response as T);
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Pay by Prime API
   * Process payment using prime token from frontend
   */
  async payByPrime(params: {
    prime: string;
    amount: number;
    details: string;
    cardholder: Cardholder;
    currency?: Currency;
    remember?: boolean;
    orderNumber?: string;
    bankTransactionId?: string;
    threeDomainSecure?: boolean;
    frontendRedirectUrl?: string;
    backendNotifyUrl?: string;
    instalment?: number;
    delayCapture?: number;
  }): Promise<PayByPrimeResponse> {
    const requestData: PayByPrimeRequest = {
      prime: params.prime,
      partner_key: this.partnerKey,
      details: params.details,
      amount: params.amount,
      currency: params.currency || 'TWD',
      cardholder: params.cardholder,
      remember: params.remember,
      order_number: params.orderNumber,
      bank_transaction_id: params.bankTransactionId,
      three_domain_secure: params.threeDomainSecure,
    };

    if (this.merchantId) {
      requestData.merchant_id = this.merchantId;
    }

    if (this.merchantGroupId) {
      requestData.merchant_group_id = this.merchantGroupId;
    }

    if (params.frontendRedirectUrl && params.backendNotifyUrl) {
      requestData.result_url = {
        frontend_redirect_url: params.frontendRedirectUrl,
        backend_notify_url: params.backendNotifyUrl,
      };
    }

    if (params.instalment) {
      requestData.instalment = params.instalment;
    }

    if (params.delayCapture) {
      requestData.delay_capture_in_days = params.delayCapture;
    }

    return this.request<PayByPrimeResponse>('/tpc/payment/pay-by-prime', requestData);
  }

  /**
   * Pay by Card Token API
   * Process payment using stored card token
   */
  async payByCardToken(params: {
    cardKey: string;
    cardToken: string;
    amount: number;
    details: string;
    cardholder: Cardholder;
    currency?: Currency;
    orderNumber?: string;
    bankTransactionId?: string;
    threeDomainSecure?: boolean;
    frontendRedirectUrl?: string;
    backendNotifyUrl?: string;
    instalment?: number;
  }): Promise<PayByCardTokenResponse> {
    const requestData: PayByCardTokenRequest = {
      card_key: params.cardKey,
      card_token: params.cardToken,
      partner_key: this.partnerKey,
      amount: params.amount,
      currency: params.currency || 'TWD',
      details: params.details,
      cardholder: params.cardholder,
      order_number: params.orderNumber,
      bank_transaction_id: params.bankTransactionId,
      three_domain_secure: params.threeDomainSecure,
    };

    if (this.merchantId) {
      requestData.merchant_id = this.merchantId;
    }

    if (this.merchantGroupId) {
      requestData.merchant_group_id = this.merchantGroupId;
    }

    if (params.frontendRedirectUrl && params.backendNotifyUrl) {
      requestData.result_url = {
        frontend_redirect_url: params.frontendRedirectUrl,
        backend_notify_url: params.backendNotifyUrl,
      };
    }

    if (params.instalment) {
      requestData.instalment = params.instalment;
    }

    return this.request<PayByCardTokenResponse>('/tpc/payment/pay-by-token', requestData);
  }

  /**
   * Refund API
   * Process full or partial refund
   */
  async refund(params: {
    recTradeId: string;
    amount?: number;
  }): Promise<RefundResponse> {
    const requestData: RefundRequest = {
      partner_key: this.partnerKey,
      rec_trade_id: params.recTradeId,
    };

    if (params.amount !== undefined) {
      requestData.amount = params.amount;
    }

    return this.request<RefundResponse>('/tpc/transaction/refund', requestData);
  }

  /**
   * Record API
   * Query transaction records
   */
  async queryRecords(params?: {
    recordsPerPage?: number;
    page?: number;
    timeRange?: {
      startTime: number;
      endTime: number;
    };
    amountRange?: {
      lowerLimit: number;
      upperLimit: number;
    };
    cardholder?: {
      phoneNumber?: string;
      name?: string;
      email?: string;
    };
    merchantId?: string;
    currency?: Currency;
    orderNumber?: string;
    recTradeId?: string;
  }): Promise<RecordResponse> {
    const requestData: RecordRequest = {
      partner_key: this.partnerKey,
    };

    if (params) {
      requestData.filters = {};

      if (params.recordsPerPage) {
        requestData.filters.records_per_page = params.recordsPerPage;
      }

      if (params.page) {
        requestData.filters.page = params.page;
      }

      if (params.timeRange) {
        requestData.filters.time = {
          start_time: params.timeRange.startTime,
          end_time: params.timeRange.endTime,
        };
      }

      if (params.amountRange) {
        requestData.filters.amount = {
          lower_limit: params.amountRange.lowerLimit,
          upper_limit: params.amountRange.upperLimit,
        };
      }

      if (params.cardholder) {
        requestData.filters.cardholder = {
          phone_number: params.cardholder.phoneNumber,
          name: params.cardholder.name,
          email: params.cardholder.email,
        };
      }

      if (params.merchantId) {
        requestData.filters.merchant_id = params.merchantId;
      }

      if (params.currency) {
        requestData.filters.currency = params.currency;
      }

      if (params.orderNumber) {
        requestData.filters.order_number = params.orderNumber;
      }

      if (params.recTradeId) {
        requestData.filters.rec_trade_id = params.recTradeId;
      }
    }

    return this.request<RecordResponse>('/tpc/transaction/query', requestData);
  }
}

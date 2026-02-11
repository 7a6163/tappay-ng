import * as https from 'https';
import {
  EInvoiceConfig,
  EInvoiceIssueRequest,
  EInvoiceIssueResponse,
  EInvoiceVoidRequest,
  EInvoiceVoidResponse,
  EInvoiceVoidWithReissueRequest,
  EInvoiceVoidWithReissueResponse,
  EInvoiceAllowanceRequest,
  EInvoiceAllowanceResponse,
  EInvoiceQueryRequest,
  EInvoiceQueryResponse,
  EInvoiceQueryAllowanceRequest,
  EInvoiceQueryAllowanceResponse,
  EInvoiceError,
  EInvoiceDetail,
  EInvoiceCarrier,
  EInvoiceAllowanceDetail,
  NotifyEmail,
  InvoiceType,
  PaymentType,
  EInvoiceCurrency,
  CustomsClearanceMarkEnum,
} from './einvoice_types';

const SANDBOX_BASE_URL = 'sandbox-invoice.tappaysdk.com';
const PRODUCTION_BASE_URL = 'invoice.tappaysdk.com';

export class EInvoiceClient {
  private partnerKey: string;
  private baseUrl: string;

  constructor(config: EInvoiceConfig) {
    this.partnerKey = config.partnerKey;
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
              const error: EInvoiceError = {
                status: response.status,
                msg: response.msg || 'Unknown error',
              };
              reject(error);
            } else {
              resolve(response as T);
            }
          } catch (_error) {
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

  async issueInvoice(params: {
    orderNumber: string;
    orderDate: string;
    sellerName?: string;
    sellerIdentifier?: string;
    buyerIdentifier?: string;
    buyerName?: string;
    buyerEmail: string;
    buyerCellPhone?: string;
    buyerAddress?: string;
    issueNotifyEmail?: NotifyEmail;
    invoiceType?: InvoiceType;
    currency?: EInvoiceCurrency;
    totalAmount: number;
    details: EInvoiceDetail[];
    taxRate?: number;
    taxAmount: number;
    salesAmount?: number;
    zeroTaxSalesAmount?: number;
    customsClearanceMarkEnum?: CustomsClearanceMarkEnum;
    freeTaxSalesAmount?: number;
    paymentType?: PaymentType;
    carrier?: EInvoiceCarrier;
    npoban?: string;
    invoiceNumber?: string;
    notifyUrl: string;
    remark?: string;
  }): Promise<EInvoiceIssueResponse> {
    const requestData: EInvoiceIssueRequest = {
      partner_key: this.partnerKey,
      order_number: params.orderNumber,
      order_date: params.orderDate,
      buyer_email: params.buyerEmail,
      currency: params.currency || 'TWD',
      total_amount: params.totalAmount,
      details: params.details,
      tax_amount: params.taxAmount,
      notify_url: params.notifyUrl,
    };

    if (params.sellerName !== undefined) {
      requestData.seller_name = params.sellerName;
    }

    if (params.sellerIdentifier !== undefined) {
      requestData.seller_identifier = params.sellerIdentifier;
    }

    if (params.buyerIdentifier !== undefined) {
      requestData.buyer_identifier = params.buyerIdentifier;
    }

    if (params.buyerName !== undefined) {
      requestData.buyer_name = params.buyerName;
    }

    if (params.buyerCellPhone !== undefined) {
      requestData.buyer_cell_phone = params.buyerCellPhone;
    }

    if (params.buyerAddress !== undefined) {
      requestData.buyer_address = params.buyerAddress;
    }

    if (params.issueNotifyEmail !== undefined) {
      requestData.issue_notify_email = params.issueNotifyEmail;
    }

    if (params.invoiceType !== undefined) {
      requestData.invoice_type = params.invoiceType;
    }

    if (params.taxRate !== undefined) {
      requestData.tax_rate = params.taxRate;
    }

    if (params.salesAmount !== undefined) {
      requestData.sales_amount = params.salesAmount;
    }

    if (params.zeroTaxSalesAmount !== undefined) {
      requestData.zero_tax_sales_amount = params.zeroTaxSalesAmount;
    }

    if (params.customsClearanceMarkEnum !== undefined) {
      requestData.customs_clearance_mark_enum = params.customsClearanceMarkEnum;
    }

    if (params.freeTaxSalesAmount !== undefined) {
      requestData.free_tax_sales_amount = params.freeTaxSalesAmount;
    }

    if (params.paymentType !== undefined) {
      requestData.payment_type = params.paymentType;
    }

    if (params.carrier !== undefined) {
      requestData.carrier = params.carrier;
    }

    if (params.npoban !== undefined) {
      requestData.npoban = params.npoban;
    }

    if (params.invoiceNumber !== undefined) {
      requestData.invoice_number = params.invoiceNumber;
    }

    if (params.remark !== undefined) {
      requestData.remark = params.remark;
    }

    return this.request<EInvoiceIssueResponse>('/einvoice/issue', requestData);
  }

  async voidInvoice(params: {
    recInvoiceId: string;
    invoiceNumber: string;
    voidOrderId: string;
    voidReason: string;
    voidNotifyEmail?: NotifyEmail;
  }): Promise<EInvoiceVoidResponse> {
    const requestData: EInvoiceVoidRequest = {
      partner_key: this.partnerKey,
      rec_invoice_id: params.recInvoiceId,
      invoice_number: params.invoiceNumber,
      void_order_id: params.voidOrderId,
      void_reason: params.voidReason,
    };

    if (params.voidNotifyEmail !== undefined) {
      requestData.void_notify_email = params.voidNotifyEmail;
    }

    return this.request<EInvoiceVoidResponse>('/einvoice/void', requestData);
  }

  async voidWithReissue(params: {
    recInvoiceId: string;
    reissueOrderId: string;
    reissueReason: string;
  }): Promise<EInvoiceVoidWithReissueResponse> {
    const requestData: EInvoiceVoidWithReissueRequest = {
      partner_key: this.partnerKey,
      rec_invoice_id: params.recInvoiceId,
      reissue_order_id: params.reissueOrderId,
      reissue_reason: params.reissueReason,
    };

    return this.request<EInvoiceVoidWithReissueResponse>('/einvoice/void-with-reissue', requestData);
  }

  async allowanceInvoice(params: {
    recInvoiceId: string;
    allowanceNumber?: string;
    allowanceNotifyEmail?: NotifyEmail;
    details: EInvoiceAllowanceDetail[];
    allowanceAmount: number;
    allowanceReason: string;
    allowanceSaleAmount: number;
    allowanceTaxAmount: number;
  }): Promise<EInvoiceAllowanceResponse> {
    const requestData: EInvoiceAllowanceRequest = {
      partner_key: this.partnerKey,
      rec_invoice_id: params.recInvoiceId,
      details: params.details,
      allowance_amount: params.allowanceAmount,
      allowance_reason: params.allowanceReason,
      allowance_sale_amount: params.allowanceSaleAmount,
      allowance_tax_amount: params.allowanceTaxAmount,
    };

    if (params.allowanceNumber !== undefined) {
      requestData.allowance_number = params.allowanceNumber;
    }

    if (params.allowanceNotifyEmail !== undefined) {
      requestData.allowance_notify_email = params.allowanceNotifyEmail;
    }

    return this.request<EInvoiceAllowanceResponse>('/einvoice/allowance', requestData);
  }

  async queryInvoice(params: {
    recInvoiceId: string;
  }): Promise<EInvoiceQueryResponse> {
    const requestData: EInvoiceQueryRequest = {
      partner_key: this.partnerKey,
      rec_invoice_id: params.recInvoiceId,
    };

    return this.request<EInvoiceQueryResponse>('/einvoice/query', requestData);
  }

  async queryAllowance(params: {
    recInvoiceId: string;
    allowanceNumber: string;
  }): Promise<EInvoiceQueryAllowanceResponse> {
    const requestData: EInvoiceQueryAllowanceRequest = {
      partner_key: this.partnerKey,
      rec_invoice_id: params.recInvoiceId,
      allowance_number: params.allowanceNumber,
    };

    return this.request<EInvoiceQueryAllowanceResponse>('/einvoice/query-allowance', requestData);
  }
}

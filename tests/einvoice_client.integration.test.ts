import * as https from 'node:https';
import { EInvoiceClient } from '../src/einvoice_client';
import { EventEmitter } from 'events';

jest.mock('node:https');

describe('EInvoiceClient Integration Tests', () => {
  let client: EInvoiceClient;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    client = new EInvoiceClient({
      partnerKey: 'test_partner_key',
      env: 'sandbox',
    });

    mockResponse = new EventEmitter();
    mockResponse.statusCode = 200;

    mockRequest = new EventEmitter();
    mockRequest.write = jest.fn();
    mockRequest.end = jest.fn();

    (https.request as jest.Mock).mockImplementation((options, callback) => {
      callback(mockResponse);
      return mockRequest;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('issueInvoice', () => {
    it('should successfully issue an invoice', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        invoice_result_error_code: '0',
        invoice_result_msg: 'Operation Succeed',
        rec_invoice_id: 'EIV20250212TUC77WU9Q',
        order_number: 'TP_TEST_01',
        invoice_issue_order_number: 'a1a1451b-810e-4cdb-8b49-f303d609249b',
        invoice_number: 'WH00000243',
        invoice_date: '20250212',
        invoice_time: '123147',
      };

      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        notifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.rec_invoice_id).toBe('EIV20250212TUC77WU9Q');
      expect(result.invoice_number).toBe('WH00000243');
    });

    it('should send correct request body with all optional fields', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        rec_invoice_id: 'EIV20250212TUC77WU9Q',
      };

      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        sellerName: 'Test Seller',
        sellerIdentifier: '12345678',
        buyerIdentifier: '87654321',
        buyerName: 'Test Buyer',
        buyerEmail: 'test@example.com',
        buyerCellPhone: '0912345678',
        buyerAddress: 'Test Address',
        issueNotifyEmail: 'AUTO',
        invoiceType: 1,
        currency: 'TWD',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxRate: 0.05,
        taxAmount: 14,
        salesAmount: 286,
        zeroTaxSalesAmount: 0,
        freeTaxSalesAmount: 0,
        paymentType: 'CREDIT_CARD',
        npoban: '0000123',
        notifyUrl: 'https://example.com/notify',
        remark: 'test remark',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      expect(mockRequest.write).toHaveBeenCalled();
      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.partner_key).toBe('test_partner_key');
      expect(requestData.order_number).toBe('TP_TEST_01');
      expect(requestData.seller_name).toBe('Test Seller');
      expect(requestData.seller_identifier).toBe('12345678');
      expect(requestData.buyer_identifier).toBe('87654321');
      expect(requestData.buyer_name).toBe('Test Buyer');
      expect(requestData.buyer_email).toBe('test@example.com');
      expect(requestData.buyer_cell_phone).toBe('0912345678');
      expect(requestData.buyer_address).toBe('Test Address');
      expect(requestData.issue_notify_email).toBe('AUTO');
      expect(requestData.invoice_type).toBe(1);
      expect(requestData.tax_rate).toBe(0.05);
      expect(requestData.sales_amount).toBe(286);
      expect(requestData.zero_tax_sales_amount).toBe(0);
      expect(requestData.free_tax_sales_amount).toBe(0);
      expect(requestData.payment_type).toBe('CREDIT_CARD');
      expect(requestData.npoban).toBe('0000123');
      expect(requestData.remark).toBe('test remark');
    });

    it('should send correct request body with carrier', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        rec_invoice_id: 'EIV20250212TUC77WU9Q',
      };

      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        carrier: { type: 1, number: '/ABC+123' },
        notifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.carrier).toEqual({ type: 1, number: '/ABC+123' });
    });

    it('should send correct request with customs clearance mark', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        rec_invoice_id: 'EIV20250212TUC77WU9Q',
      };

      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'export item',
            tax_type: 2,
          },
        ],
        taxAmount: 0,
        customsClearanceMarkEnum: 1,
        notifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.customs_clearance_mark_enum).toBe(1);
    });

    it('should send correct request with invoice number for reissue', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        rec_invoice_id: 'EIV20250212TUC77WU9Q',
      };

      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        invoiceNumber: 'WH00000243',
        notifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.invoice_number).toBe('WH00000243');
    });

    it('should handle API error response', async () => {
      const errorData = {
        status: 1,
        msg: 'Failed',
      };

      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        notifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(errorData));
      mockResponse.emit('end');

      await expect(promise).rejects.toEqual({
        status: 1,
        msg: 'Failed',
      });
    });

    it('should send request-id header when requestId is provided', async () => {
      const responseData = { status: 0, msg: 'SUCCESS' };

      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        notifyUrl: 'https://example.com/notify',
        requestId: 'req-123',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const options = (https.request as jest.Mock).mock.calls[0][0];
      expect(options.headers['request-id']).toBe('req-123');
    });

    it('should handle JSON parse error', async () => {
      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        notifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', 'invalid json');
      mockResponse.emit('end');

      await expect(promise).rejects.toThrow('Failed to parse response');
    });

    it('should handle network error', async () => {
      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        notifyUrl: 'https://example.com/notify',
      });

      mockRequest.emit('error', new Error('Network error'));

      await expect(promise).rejects.toThrow('Network error');
    });

    it('should use sandbox domain by default', async () => {
      const responseData = { status: 0, msg: 'SUCCESS' };

      const promise = client.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        notifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const options = (https.request as jest.Mock).mock.calls[0][0];
      expect(options.hostname).toBe('sandbox-invoice.tappaysdk.com');
      expect(options.path).toBe('/einvoice/issue');
      expect(options.method).toBe('POST');
      expect(options.headers['x-api-key']).toBe('test_partner_key');
    });

    it('should use production domain when configured', async () => {
      const prodClient = new EInvoiceClient({
        partnerKey: 'test_partner_key',
        env: 'production',
      });

      const responseData = { status: 0, msg: 'SUCCESS' };

      const promise = prodClient.issueInvoice({
        orderNumber: 'TP_TEST_01',
        orderDate: '20250212',
        buyerEmail: 'test@example.com',
        totalAmount: 300,
        details: [
          {
            sequence_id: '001',
            sub_amount: 300,
            unit_price: 300,
            quantity: 1,
            description: 'example',
            tax_type: 1,
          },
        ],
        taxAmount: 0,
        notifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const options = (https.request as jest.Mock).mock.calls[0][0];
      expect(options.hostname).toBe('invoice.tappaysdk.com');
    });
  });

  describe('voidInvoice', () => {
    it('should successfully void an invoice', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        invoice_result_error_code: '0',
        invoice_result_msg: 'Operation Succeed',
        invoice_void_order_number: 'ac3dd637-2cb5-4d37-8197-af8ad8755357',
        invoice_number: 'WH00000243',
        void_date: '20250212',
        void_time: '171801',
      };

      const promise = client.voidInvoice({
        recInvoiceId: 'EIV20250212TUC77WU9Q',
        invoiceNumber: 'WH00000243',
        voidOrderId: 'VOID_001',
        voidReason: 'test void',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.invoice_number).toBe('WH00000243');
      expect(result.void_date).toBe('20250212');
    });

    it('should send correct request body', async () => {
      const responseData = { status: 0, msg: 'SUCCESS' };

      const promise = client.voidInvoice({
        recInvoiceId: 'EIV20250212TUC77WU9Q',
        invoiceNumber: 'WH00000243',
        voidOrderId: 'VOID_001',
        voidReason: 'test void',
        voidNotifyEmail: 'MANU',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.partner_key).toBe('test_partner_key');
      expect(requestData.rec_invoice_id).toBe('EIV20250212TUC77WU9Q');
      expect(requestData.invoice_number).toBe('WH00000243');
      expect(requestData.void_order_id).toBe('VOID_001');
      expect(requestData.void_reason).toBe('test void');
      expect(requestData.void_notify_email).toBe('MANU');
    });

    it('should handle API error response', async () => {
      const errorData = { status: 1, msg: 'Invoice not found' };

      const promise = client.voidInvoice({
        recInvoiceId: 'INVALID',
        invoiceNumber: 'WH00000243',
        voidOrderId: 'VOID_001',
        voidReason: 'test void',
      });

      mockResponse.emit('data', JSON.stringify(errorData));
      mockResponse.emit('end');

      await expect(promise).rejects.toEqual({
        status: 1,
        msg: 'Invoice not found',
      });
    });
  });

  describe('voidWithReissue', () => {
    it('should successfully void with reissue', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        invoice_result_error_code: 'V0',
        invoice_result_msg: '註銷申請成功',
        invoice_reissue_order_number: '1140102JL021200063176',
        invoice_number: 'JL02120006',
        reissue_date: '20250220',
        reissue_time: '150518',
      };

      const promise = client.voidWithReissue({
        recInvoiceId: 'EIV20250213AQRHVKAE4',
        reissueOrderId: 'TESTAE4',
        reissueReason: 'test reissue',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.invoice_number).toBe('JL02120006');
      expect(result.reissue_date).toBe('20250220');
    });

    it('should send correct request body', async () => {
      const responseData = { status: 0, msg: 'SUCCESS' };

      const promise = client.voidWithReissue({
        recInvoiceId: 'EIV20250213AQRHVKAE4',
        reissueOrderId: 'TESTAE4',
        reissueReason: 'test reissue',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.partner_key).toBe('test_partner_key');
      expect(requestData.rec_invoice_id).toBe('EIV20250213AQRHVKAE4');
      expect(requestData.reissue_order_id).toBe('TESTAE4');
      expect(requestData.reissue_reason).toBe('test reissue');
    });

    it('should handle API error response', async () => {
      const errorData = { status: 1, msg: 'Reissue not allowed' };

      const promise = client.voidWithReissue({
        recInvoiceId: 'INVALID',
        reissueOrderId: 'TESTAE4',
        reissueReason: 'test reissue',
      });

      mockResponse.emit('data', JSON.stringify(errorData));
      mockResponse.emit('end');

      await expect(promise).rejects.toEqual({
        status: 1,
        msg: 'Reissue not allowed',
      });
    });
  });

  describe('allowanceInvoice', () => {
    it('should successfully create allowance', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        invoice_result_error_code: 'A0',
        invoice_result_msg: '開立成功',
        invoice_allowance_order_number: '1739521402386',
        invoice_number: 'JL02120007',
        allowance_number: '1739521402386',
        remain_amount: 201,
        allowance_date: '20250214',
        allowance_time: '162322',
      };

      const promise = client.allowanceInvoice({
        recInvoiceId: 'EIV202502145E6AFZTE7',
        details: [
          {
            sequence_id: '001',
            sub_amount: 99,
            unit_price: 99,
            quantity: 1,
            description: 'test',
            tax_type: 1,
            tax_amount: 0,
          },
        ],
        allowanceAmount: 99,
        allowanceReason: 'test allowance',
        allowanceSaleAmount: 99,
        allowanceTaxAmount: 0,
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.remain_amount).toBe(201);
      expect(result.allowance_number).toBe('1739521402386');
    });

    it('should send correct request body with optional fields', async () => {
      const responseData = { status: 0, msg: 'SUCCESS' };

      const promise = client.allowanceInvoice({
        recInvoiceId: 'EIV202502145E6AFZTE7',
        allowanceNumber: 'CUSTOM_001',
        allowanceNotifyEmail: 'MANU',
        details: [
          {
            sequence_id: '001',
            sub_amount: 99,
            unit_price: 99,
            quantity: 1,
            tax_type: 1,
            tax_amount: 0,
          },
        ],
        allowanceAmount: 99,
        allowanceReason: 'test allowance',
        allowanceSaleAmount: 99,
        allowanceTaxAmount: 0,
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.partner_key).toBe('test_partner_key');
      expect(requestData.rec_invoice_id).toBe('EIV202502145E6AFZTE7');
      expect(requestData.allowance_number).toBe('CUSTOM_001');
      expect(requestData.allowance_notify_email).toBe('MANU');
      expect(requestData.allowance_amount).toBe(99);
      expect(requestData.allowance_reason).toBe('test allowance');
      expect(requestData.allowance_sale_amount).toBe(99);
      expect(requestData.allowance_tax_amount).toBe(0);
      expect(requestData.details).toHaveLength(1);
    });

    it('should handle API error response', async () => {
      const errorData = { status: 1, msg: 'Allowance failed' };

      const promise = client.allowanceInvoice({
        recInvoiceId: 'INVALID',
        details: [
          {
            sequence_id: '001',
            sub_amount: 99,
            unit_price: 99,
            quantity: 1,
            tax_type: 1,
            tax_amount: 0,
          },
        ],
        allowanceAmount: 99,
        allowanceReason: 'test',
        allowanceSaleAmount: 99,
        allowanceTaxAmount: 0,
      });

      mockResponse.emit('data', JSON.stringify(errorData));
      mockResponse.emit('end');

      await expect(promise).rejects.toEqual({
        status: 1,
        msg: 'Allowance failed',
      });
    });
  });

  describe('queryInvoice', () => {
    it('should successfully query an invoice', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        invoice_result_error_code: 'Success',
        invoice_result_msg: '查詢成功',
        rec_invoice_id: 'EIV202502145E6AFZTE7',
        invoice_status: 'ISSUED',
        invoice_number: 'JL02120007',
        seller_info: { identifier: '24951774' },
        buyer_info: {
          identifier: '',
          email: 'buyer@email.com',
          notify_type: 'AUTO',
        },
        currency: 'TWD',
        tax_amount: 0,
        sales_amount: 300,
        free_tax_sales_amount: 0,
        zero_tax_sales_amount: 0,
        total_amount: 300,
        payment_type: '',
        carrier: {},
        npoban: '0000123',
        remark: '',
      };

      const promise = client.queryInvoice({
        recInvoiceId: 'EIV202502145E6AFZTE7',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.invoice_number).toBe('JL02120007');
      expect(result.total_amount).toBe(300);
      expect(result.invoice_status).toBe('ISSUED');
    });

    it('should send correct request body', async () => {
      const responseData = { status: 0, msg: 'SUCCESS' };

      const promise = client.queryInvoice({
        recInvoiceId: 'EIV202502145E6AFZTE7',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.partner_key).toBe('test_partner_key');
      expect(requestData.rec_invoice_id).toBe('EIV202502145E6AFZTE7');
    });

    it('should handle API error response', async () => {
      const errorData = { status: 1, msg: 'Not found' };

      const promise = client.queryInvoice({
        recInvoiceId: 'INVALID',
      });

      mockResponse.emit('data', JSON.stringify(errorData));
      mockResponse.emit('end');

      await expect(promise).rejects.toEqual({
        status: 1,
        msg: 'Not found',
      });
    });
  });

  describe('queryAllowance', () => {
    it('should successfully query allowance', async () => {
      const responseData = {
        status: 0,
        msg: 'SUCCESS',
        rec_invoice_id: 'EIV202502145E6AFZTE7',
        allowance_number: '1739521402386',
        invoice_number: 'JL02120007',
        allowance_amount: 99,
        allowance_date: '20250214',
        allowance_time: '162322',
      };

      const promise = client.queryAllowance({
        recInvoiceId: 'EIV202502145E6AFZTE7',
        allowanceNumber: '1739521402386',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.allowance_number).toBe('1739521402386');
      expect(result.allowance_amount).toBe(99);
    });

    it('should send correct request body', async () => {
      const responseData = { status: 0, msg: 'SUCCESS' };

      const promise = client.queryAllowance({
        recInvoiceId: 'EIV202502145E6AFZTE7',
        allowanceNumber: '1739521402386',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      await promise;

      const requestData = JSON.parse(mockRequest.write.mock.calls[0][0]);
      expect(requestData.partner_key).toBe('test_partner_key');
      expect(requestData.rec_invoice_id).toBe('EIV202502145E6AFZTE7');
      expect(requestData.allowance_number).toBe('1739521402386');
    });

    it('should handle API error response', async () => {
      const errorData = { status: 1, msg: 'Allowance not found' };

      const promise = client.queryAllowance({
        recInvoiceId: 'INVALID',
        allowanceNumber: 'INVALID',
      });

      mockResponse.emit('data', JSON.stringify(errorData));
      mockResponse.emit('end');

      await expect(promise).rejects.toEqual({
        status: 1,
        msg: 'Allowance not found',
      });
    });
  });

  describe('request configuration', () => {
    it('should use correct API paths for each method', async () => {
      const responseData = { status: 0, msg: 'SUCCESS' };

      // Test void path
      const voidPromise = client.voidInvoice({
        recInvoiceId: 'EIV20250212TUC77WU9Q',
        invoiceNumber: 'WH00000243',
        voidOrderId: 'VOID_001',
        voidReason: 'test',
      });
      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');
      await voidPromise;

      let options = (https.request as jest.Mock).mock.calls[0][0];
      expect(options.path).toBe('/einvoice/void');

      jest.clearAllMocks();

      // Reset mock for next call
      mockResponse = new EventEmitter();
      mockRequest = new EventEmitter();
      mockRequest.write = jest.fn();
      mockRequest.end = jest.fn();
      (https.request as jest.Mock).mockImplementation((opts, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      // Test void-with-reissue path
      const reissuePromise = client.voidWithReissue({
        recInvoiceId: 'EIV20250213AQRHVKAE4',
        reissueOrderId: 'TESTAE4',
        reissueReason: 'test',
      });
      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');
      await reissuePromise;

      options = (https.request as jest.Mock).mock.calls[0][0];
      expect(options.path).toBe('/einvoice/void-with-reissue');

      jest.clearAllMocks();

      mockResponse = new EventEmitter();
      mockRequest = new EventEmitter();
      mockRequest.write = jest.fn();
      mockRequest.end = jest.fn();
      (https.request as jest.Mock).mockImplementation((opts, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      // Test allowance path
      const allowancePromise = client.allowanceInvoice({
        recInvoiceId: 'EIV202502145E6AFZTE7',
        details: [{ sequence_id: '001', sub_amount: 99, unit_price: 99, quantity: 1, tax_type: 1, tax_amount: 0 }],
        allowanceAmount: 99,
        allowanceReason: 'test',
        allowanceSaleAmount: 99,
        allowanceTaxAmount: 0,
      });
      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');
      await allowancePromise;

      options = (https.request as jest.Mock).mock.calls[0][0];
      expect(options.path).toBe('/einvoice/allowance');

      jest.clearAllMocks();

      mockResponse = new EventEmitter();
      mockRequest = new EventEmitter();
      mockRequest.write = jest.fn();
      mockRequest.end = jest.fn();
      (https.request as jest.Mock).mockImplementation((opts, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      // Test query path
      const queryPromise = client.queryInvoice({
        recInvoiceId: 'EIV202502145E6AFZTE7',
      });
      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');
      await queryPromise;

      options = (https.request as jest.Mock).mock.calls[0][0];
      expect(options.path).toBe('/einvoice/query');

      jest.clearAllMocks();

      mockResponse = new EventEmitter();
      mockRequest = new EventEmitter();
      mockRequest.write = jest.fn();
      mockRequest.end = jest.fn();
      (https.request as jest.Mock).mockImplementation((opts, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      // Test query-allowance path
      const queryAllowancePromise = client.queryAllowance({
        recInvoiceId: 'EIV202502145E6AFZTE7',
        allowanceNumber: '1739521402386',
      });
      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');
      await queryAllowancePromise;

      options = (https.request as jest.Mock).mock.calls[0][0];
      expect(options.path).toBe('/einvoice/query-allowance');
    });
  });
});

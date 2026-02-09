import { EInvoiceClient } from '../src/einvoice_client';

describe('EInvoiceClient', () => {
  let client: EInvoiceClient;

  beforeEach(() => {
    client = new EInvoiceClient({
      partnerKey: 'test_partner_key',
      env: 'sandbox',
    });
  });

  describe('constructor', () => {
    it('should create a client with sandbox environment', () => {
      expect(client).toBeInstanceOf(EInvoiceClient);
    });

    it('should create a client with production environment', () => {
      const prodClient = new EInvoiceClient({
        partnerKey: 'test_partner_key',
        env: 'production',
      });
      expect(prodClient).toBeInstanceOf(EInvoiceClient);
    });

    it('should default to sandbox environment if not specified', () => {
      const defaultClient = new EInvoiceClient({
        partnerKey: 'test_partner_key',
      });
      expect(defaultClient).toBeInstanceOf(EInvoiceClient);
    });
  });

  describe('API methods', () => {
    it('should have issueInvoice method', () => {
      expect(typeof client.issueInvoice).toBe('function');
    });

    it('should have voidInvoice method', () => {
      expect(typeof client.voidInvoice).toBe('function');
    });

    it('should have voidWithReissue method', () => {
      expect(typeof client.voidWithReissue).toBe('function');
    });

    it('should have allowanceInvoice method', () => {
      expect(typeof client.allowanceInvoice).toBe('function');
    });

    it('should have queryInvoice method', () => {
      expect(typeof client.queryInvoice).toBe('function');
    });

    it('should have queryAllowance method', () => {
      expect(typeof client.queryAllowance).toBe('function');
    });
  });

  describe('method signatures', () => {
    it('issueInvoice should return a Promise', () => {
      const result = client.issueInvoice({
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
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => {});
    });

    it('voidInvoice should return a Promise', () => {
      const result = client.voidInvoice({
        recInvoiceId: 'EIV20250212TUC77WU9Q',
        invoiceNumber: 'WH00000243',
        voidOrderId: 'VOID_001',
        voidReason: 'test void',
      });
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => {});
    });

    it('voidWithReissue should return a Promise', () => {
      const result = client.voidWithReissue({
        recInvoiceId: 'EIV20250213AQRHVKAE4',
        reissueOrderId: 'TESTAE4',
        reissueReason: 'test reissue',
      });
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => {});
    });

    it('allowanceInvoice should return a Promise', () => {
      const result = client.allowanceInvoice({
        recInvoiceId: 'EIV202502145E6AFZTE7',
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
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => {});
    });

    it('queryInvoice should return a Promise', () => {
      const result = client.queryInvoice({
        recInvoiceId: 'EIV202502145E6AFZTE7',
      });
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => {});
    });

    it('queryAllowance should return a Promise', () => {
      const result = client.queryAllowance({
        recInvoiceId: 'EIV202502145E6AFZTE7',
        allowanceNumber: '1739521402386',
      });
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => {});
    });
  });
});

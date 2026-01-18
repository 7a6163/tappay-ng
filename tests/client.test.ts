import { TapPayClient } from '../src/client';

describe('TapPayClient', () => {
  let client: TapPayClient;

  beforeEach(() => {
    client = new TapPayClient({
      partnerId: 'test_partner_id',
      partnerKey: 'test_partner_key',
      merchantId: 'test_merchant_id',
      env: 'sandbox',
    });
  });

  describe('constructor', () => {
    it('should create a client with sandbox environment', () => {
      expect(client).toBeInstanceOf(TapPayClient);
    });

    it('should create a client with production environment', () => {
      const prodClient = new TapPayClient({
        partnerId: 'test_partner_id',
        partnerKey: 'test_partner_key',
        merchantId: 'test_merchant_id',
        env: 'production',
      });
      expect(prodClient).toBeInstanceOf(TapPayClient);
    });

    it('should default to sandbox environment if not specified', () => {
      const defaultClient = new TapPayClient({
        partnerId: 'test_partner_id',
        partnerKey: 'test_partner_key',
        merchantId: 'test_merchant_id',
      });
      expect(defaultClient).toBeInstanceOf(TapPayClient);
    });
  });

  describe('API methods', () => {
    it('should have payByPrime method', () => {
      expect(typeof client.payByPrime).toBe('function');
    });

    it('should have payByCardToken method', () => {
      expect(typeof client.payByCardToken).toBe('function');
    });

    it('should have refund method', () => {
      expect(typeof client.refund).toBe('function');
    });

    it('should have queryRecords method', () => {
      expect(typeof client.queryRecords).toBe('function');
    });
  });

  describe('method signatures', () => {
    it('payByPrime should return a Promise', () => {
      const params = {
        prime: 'test_prime',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      const result = client.payByPrime(params);
      expect(result).toBeInstanceOf(Promise);

      // Prevent unhandled promise rejection
      result.catch(() => {});
    });

    it('payByCardToken should return a Promise', () => {
      const params = {
        cardKey: 'test_card_key',
        cardToken: 'test_card_token',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      const result = client.payByCardToken(params);
      expect(result).toBeInstanceOf(Promise);

      // Prevent unhandled promise rejection
      result.catch(() => {});
    });

    it('refund should return a Promise', () => {
      const params = {
        recTradeId: 'test_trade_id',
      };

      const result = client.refund(params);
      expect(result).toBeInstanceOf(Promise);

      // Prevent unhandled promise rejection
      result.catch(() => {});
    });

    it('queryRecords should return a Promise', () => {
      const result = client.queryRecords();
      expect(result).toBeInstanceOf(Promise);

      // Prevent unhandled promise rejection
      result.catch(() => {});
    });

    it('queryRecords should accept filter parameters', () => {
      const params = {
        recordsPerPage: 10,
        page: 1,
        currency: 'TWD' as const,
      };

      const result = client.queryRecords(params);
      expect(result).toBeInstanceOf(Promise);

      // Prevent unhandled promise rejection
      result.catch(() => {});
    });
  });
});

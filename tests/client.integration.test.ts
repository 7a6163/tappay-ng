import * as https from 'https';
import { TapPayClient } from '../src/client';
import { EventEmitter } from 'events';

// Mock https module
jest.mock('https');

describe('TapPayClient Integration Tests', () => {
  let client: TapPayClient;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    client = new TapPayClient({
      partnerId: 'test_partner_id',
      partnerKey: 'test_partner_key',
      merchantId: 'test_merchant_id',
      env: 'sandbox',
    });

    // Create mock response
    mockResponse = new EventEmitter();
    mockResponse.statusCode = 200;

    // Create mock request
    mockRequest = new EventEmitter();
    mockRequest.write = jest.fn();
    mockRequest.end = jest.fn();

    // Mock https.request
    (https.request as jest.Mock).mockImplementation((options, callback) => {
      callback(mockResponse);
      return mockRequest;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('payByPrime', () => {
    it('should successfully process payment', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        rec_trade_id: 'trade_123',
        bank_transaction_id: 'bank_123',
        auth_code: 'auth_123',
        card_info: {
          bin_code: '424242',
          last_four: '4242',
          issuer: 'Test Bank',
          funding: 1,
          type: 1,
          level: '',
          country: 'TW',
          country_code: 'TW',
        },
        amount: 100,
        currency: 'TWD',
        card_secret: {
          card_key: 'key_123',
          card_token: 'token_123',
        },
      };

      const promise = client.payByPrime({
        prime: 'test_prime',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
        remember: true,
      });

      // Emit response data
      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.rec_trade_id).toBe('trade_123');
    });

    it('should handle payment with 3D Secure', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        payment_url: 'https://example.com/3ds',
      };

      const promise = client.payByPrime({
        prime: 'test_prime',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
        threeDomainSecure: true,
        frontendRedirectUrl: 'https://example.com/return',
        backendNotifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.payment_url).toBe('https://example.com/3ds');
    });

    it('should handle payment with instalment', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        rec_trade_id: 'trade_123',
      };

      const promise = client.payByPrime({
        prime: 'test_prime',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
        instalment: 3,
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });

    it('should handle payment with delay capture', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        rec_trade_id: 'trade_123',
      };

      const promise = client.payByPrime({
        prime: 'test_prime',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
        delayCapture: 7,
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });

    it('should handle API error response', async () => {
      const errorData = {
        status: 1,
        msg: 'Invalid prime',
      };

      const promise = client.payByPrime({
        prime: 'invalid_prime',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      mockResponse.emit('data', JSON.stringify(errorData));
      mockResponse.emit('end');

      await expect(promise).rejects.toEqual({
        status: 1,
        msg: 'Invalid prime',
      });
    });

    it('should handle JSON parse error', async () => {
      const promise = client.payByPrime({
        prime: 'test_prime',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      mockResponse.emit('data', 'invalid json');
      mockResponse.emit('end');

      await expect(promise).rejects.toThrow('Failed to parse response');
    });

    it('should handle network error', async () => {
      const promise = client.payByPrime({
        prime: 'test_prime',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      mockRequest.emit('error', new Error('Network error'));

      await expect(promise).rejects.toThrow('Network error');
    });
  });

  describe('payByCardToken', () => {
    it('should successfully process payment', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        rec_trade_id: 'trade_123',
      };

      const promise = client.payByCardToken({
        cardKey: 'key_123',
        cardToken: 'token_123',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });

    it('should handle payment with 3D Secure', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        payment_url: 'https://example.com/3ds',
      };

      const promise = client.payByCardToken({
        cardKey: 'key_123',
        cardToken: 'token_123',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
        threeDomainSecure: true,
        frontendRedirectUrl: 'https://example.com/return',
        backendNotifyUrl: 'https://example.com/notify',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.payment_url).toBe('https://example.com/3ds');
    });

    it('should handle payment with instalment', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        rec_trade_id: 'trade_123',
      };

      const promise = client.payByCardToken({
        cardKey: 'key_123',
        cardToken: 'token_123',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
        instalment: 6,
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });
  });

  describe('refund', () => {
    it('should successfully process full refund', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        rec_trade_id: 'trade_123',
        refund_amount: 100,
      };

      const promise = client.refund({
        recTradeId: 'trade_123',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.refund_amount).toBe(100);
    });

    it('should successfully process partial refund', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        rec_trade_id: 'trade_123',
        refund_amount: 50,
      };

      const promise = client.refund({
        recTradeId: 'trade_123',
        amount: 50,
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.refund_amount).toBe(50);
    });
  });

  describe('queryRecords', () => {
    it('should query all records', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        number_of_transactions: 10,
        trade_records: [],
      };

      const promise = client.queryRecords();

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
      expect(result.number_of_transactions).toBe(10);
    });

    it('should query records with time range', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        number_of_transactions: 5,
        trade_records: [],
      };

      const promise = client.queryRecords({
        timeRange: {
          startTime: 1609459200000,
          endTime: 1612137600000,
        },
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });

    it('should query records with amount range', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        number_of_transactions: 3,
        trade_records: [],
      };

      const promise = client.queryRecords({
        amountRange: {
          lowerLimit: 100,
          upperLimit: 1000,
        },
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });

    it('should query records with cardholder filter', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        number_of_transactions: 2,
        trade_records: [],
      };

      const promise = client.queryRecords({
        cardholder: {
          phoneNumber: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });

    it('should query records with merchant ID', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        number_of_transactions: 1,
        trade_records: [],
      };

      const promise = client.queryRecords({
        merchantId: 'merchant_123',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });

    it('should query records with order number', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        number_of_transactions: 1,
        trade_records: [],
      };

      const promise = client.queryRecords({
        orderNumber: 'ORDER-123',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });

    it('should query records with rec trade ID', async () => {
      const responseData = {
        status: 0,
        msg: 'Success',
        number_of_transactions: 1,
        trade_records: [],
      };

      const promise = client.queryRecords({
        recTradeId: 'trade_123',
      });

      mockResponse.emit('data', JSON.stringify(responseData));
      mockResponse.emit('end');

      const result = await promise;
      expect(result.status).toBe(0);
    });
  });
});

import {
  TapPayConfig,
  Currency,
  Cardholder,
  PayByPrimeRequest,
  PayByCardTokenRequest,
  RefundRequest,
  RecordRequest,
} from '../src/types';

describe('Types', () => {
  describe('TapPayConfig', () => {
    it('should allow valid configuration', () => {
      const config: TapPayConfig = {
        partnerId: 'test_id',
        partnerKey: 'test_key',
        merchantId: 'test_merchant',
        env: 'sandbox',
      };
      expect(config).toBeDefined();
    });

    it('should allow configuration without env', () => {
      const config: TapPayConfig = {
        partnerId: 'test_id',
        partnerKey: 'test_key',
        merchantId: 'test_merchant',
      };
      expect(config).toBeDefined();
    });

    it('should allow configuration with merchantId only', () => {
      const config: TapPayConfig = {
        partnerId: 'test_id',
        partnerKey: 'test_key',
        merchantId: 'test_merchant',
        env: 'sandbox',
      };
      expect(config).toBeDefined();
    });

    it('should allow configuration with merchantGroupId only', () => {
      const config: TapPayConfig = {
        partnerId: 'test_id',
        partnerKey: 'test_key',
        merchantGroupId: 'test_merchant_group',
        env: 'sandbox',
      };
      expect(config).toBeDefined();
    });
  });

  describe('Currency', () => {
    it('should accept valid currency codes', () => {
      const currencies: Currency[] = ['TWD', 'USD', 'JPY'];
      expect(currencies).toHaveLength(3);
    });
  });

  describe('Cardholder', () => {
    it('should require mandatory fields', () => {
      const cardholder: Cardholder = {
        phone_number: '+886912345678',
        name: 'Test User',
        email: 'test@example.com',
      };
      expect(cardholder).toBeDefined();
    });

    it('should allow optional fields', () => {
      const cardholder: Cardholder = {
        phone_number: '+886912345678',
        name: 'Test User',
        email: 'test@example.com',
        zip_code: '100',
        address: 'Taipei',
        national_id: 'A123456789',
        member_id: 'member_001',
      };
      expect(cardholder).toBeDefined();
    });
  });

  describe('PayByPrimeRequest', () => {
    it('should have all required fields', () => {
      const request: PayByPrimeRequest = {
        prime: 'test_prime',
        partner_key: 'test_key',
        merchant_id: 'test_merchant',
        details: 'Test payment',
        amount: 100,
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      };
      expect(request).toBeDefined();
    });

    it('should allow merchant_group_id instead of merchant_id', () => {
      const request: PayByPrimeRequest = {
        prime: 'test_prime',
        partner_key: 'test_key',
        merchant_group_id: 'test_merchant_group',
        details: 'Test payment',
        amount: 100,
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      };
      expect(request).toBeDefined();
    });
  });

  describe('PayByCardTokenRequest', () => {
    it('should have card credentials', () => {
      const request: PayByCardTokenRequest = {
        card_key: 'test_card_key',
        card_token: 'test_card_token',
        partner_key: 'test_key',
        merchant_id: 'test_merchant',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      };
      expect(request).toBeDefined();
    });

    it('should allow merchant_group_id instead of merchant_id', () => {
      const request: PayByCardTokenRequest = {
        card_key: 'test_card_key',
        card_token: 'test_card_token',
        partner_key: 'test_key',
        merchant_group_id: 'test_merchant_group',
        amount: 100,
        details: 'Test payment',
        cardholder: {
          phone_number: '+886912345678',
          name: 'Test User',
          email: 'test@example.com',
        },
      };
      expect(request).toBeDefined();
    });
  });

  describe('RefundRequest', () => {
    it('should require partner_key and rec_trade_id', () => {
      const request: RefundRequest = {
        partner_key: 'test_key',
        rec_trade_id: 'test_trade_id',
      };
      expect(request).toBeDefined();
    });

    it('should allow optional amount', () => {
      const request: RefundRequest = {
        partner_key: 'test_key',
        rec_trade_id: 'test_trade_id',
        amount: 50,
      };
      expect(request).toBeDefined();
    });
  });

  describe('RecordRequest', () => {
    it('should require only partner_key', () => {
      const request: RecordRequest = {
        partner_key: 'test_key',
      };
      expect(request).toBeDefined();
    });

    it('should allow optional filters', () => {
      const request: RecordRequest = {
        partner_key: 'test_key',
        filters: {
          records_per_page: 10,
          page: 1,
          currency: 'TWD',
        },
      };
      expect(request).toBeDefined();
    });
  });
});

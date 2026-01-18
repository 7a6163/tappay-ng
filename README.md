# TapPay NG

TapPay SDK for Node.js with TypeScript support. Minimal dependencies implementation using only Node.js built-in modules.

## Features

- 🚀 Zero external dependencies (only TypeScript for development)
- 📘 Full TypeScript support with type definitions
- 🔒 Type-safe API interfaces
- 🎯 Simple and intuitive API
- ✅ Support for all TapPay backend APIs

## Installation

```bash
npm install tappay-ng
```

## Supported APIs

- **Pay by Prime** - Process payment using prime token from frontend
- **Pay by Card Token** - Process payment using stored card token (for recurring payments)
- **Refund** - Process full or partial refund
- **Record Query** - Query transaction records

## Quick Start

```typescript
import { TapPayClient } from 'tappay-ng';

const client = new TapPayClient({
  partnerId: 'YOUR_PARTNER_ID',
  partnerKey: 'YOUR_PARTNER_KEY',
  merchantId: 'YOUR_MERCHANT_ID',
  env: 'sandbox', // or 'production'
});
```

## Usage Examples

### Pay by Prime

```typescript
const response = await client.payByPrime({
  prime: 'prime_from_frontend',
  amount: 100,
  details: 'Order payment',
  cardholder: {
    phone_number: '+886912345678',
    name: 'Test User',
    email: 'test@example.com',
    zip_code: '100',
    address: 'Taipei',
  },
  currency: 'TWD',
  orderNumber: 'ORDER-123',
  remember: true, // Save card for future use
});

console.log('Transaction ID:', response.rec_trade_id);
console.log('Card Info:', response.card_info);

// If remember is true, you can get card_secret for future payments
if (response.card_secret) {
  console.log('Card Key:', response.card_secret.card_key);
  console.log('Card Token:', response.card_secret.card_token);
}
```

### Pay by Prime with 3D Secure

```typescript
const response = await client.payByPrime({
  prime: 'prime_from_frontend',
  amount: 100,
  details: 'Order payment',
  cardholder: {
    phone_number: '+886912345678',
    name: 'Test User',
    email: 'test@example.com',
  },
  threeDomainSecure: true,
  frontendRedirectUrl: 'https://your-site.com/payment/result',
  backendNotifyUrl: 'https://your-site.com/api/payment/notify',
});

// For 3D Secure, redirect user to payment_url
if (response.payment_url) {
  console.log('Redirect user to:', response.payment_url);
}
```

### Pay by Card Token

```typescript
// Use saved card_key and card_token from previous payment
const response = await client.payByCardToken({
  cardKey: 'saved_card_key',
  cardToken: 'saved_card_token',
  amount: 100,
  details: 'Subscription payment',
  cardholder: {
    phone_number: '+886912345678',
    name: 'Test User',
    email: 'test@example.com',
  },
  orderNumber: 'SUB-456',
});

console.log('Transaction ID:', response.rec_trade_id);
```

### Refund

```typescript
// Full refund
const response = await client.refund({
  recTradeId: 'transaction_id_to_refund',
});

// Partial refund
const partialResponse = await client.refund({
  recTradeId: 'transaction_id_to_refund',
  amount: 50, // Refund partial amount
});

console.log('Refund Amount:', response.refund_amount);
```

### Query Transaction Records

```typescript
// Query all records
const records = await client.queryRecords();

console.log('Total transactions:', records.number_of_transactions);
console.log('Records:', records.trade_records);

// Query with filters
const filteredRecords = await client.queryRecords({
  recordsPerPage: 20,
  page: 1,
  timeRange: {
    startTime: 1609459200000, // timestamp in milliseconds
    endTime: 1612137600000,
  },
  amountRange: {
    lowerLimit: 100,
    upperLimit: 1000,
  },
  currency: 'TWD',
  orderNumber: 'ORDER-123',
});

// Query by specific transaction ID
const specificRecord = await client.queryRecords({
  recTradeId: 'specific_transaction_id',
});
```

## API Reference

### TapPayClient

#### Constructor

```typescript
new TapPayClient(config: TapPayConfig)
```

**TapPayConfig:**
- `partnerId` (string) - Your TapPay partner ID
- `partnerKey` (string) - Your TapPay partner key
- `merchantId` (string) - Your merchant ID
- `env` (optional) - Environment: `'sandbox'` or `'production'` (default: `'sandbox'`)

#### Methods

##### payByPrime(params)

Process payment using prime token from frontend.

**Parameters:**
- `prime` (string) - Prime token from TapPay frontend SDK
- `amount` (number) - Payment amount
- `details` (string) - Payment description
- `cardholder` (Cardholder) - Cardholder information
- `currency` (optional) - Currency code (default: `'TWD'`)
- `remember` (optional) - Save card for future use (default: `false`)
- `orderNumber` (optional) - Your order number
- `bankTransactionId` (optional) - Bank transaction ID
- `threeDomainSecure` (optional) - Enable 3D Secure
- `frontendRedirectUrl` (optional) - Frontend redirect URL (required for 3DS)
- `backendNotifyUrl` (optional) - Backend notify URL (required for 3DS)
- `instalment` (optional) - Number of instalments
- `delayCapture` (optional) - Days to delay capture

##### payByCardToken(params)

Process payment using stored card token.

**Parameters:**
- `cardKey` (string) - Card key from previous payment
- `cardToken` (string) - Card token from previous payment
- `amount` (number) - Payment amount
- `details` (string) - Payment description
- `cardholder` (Cardholder) - Cardholder information
- `currency` (optional) - Currency code (default: `'TWD'`)
- Other optional parameters similar to payByPrime

##### refund(params)

Process refund for a transaction.

**Parameters:**
- `recTradeId` (string) - Transaction ID to refund
- `amount` (optional) - Refund amount (omit for full refund)

##### queryRecords(params)

Query transaction records.

**Parameters:**
- `recordsPerPage` (optional) - Number of records per page
- `page` (optional) - Page number
- `timeRange` (optional) - Time range filter
- `amountRange` (optional) - Amount range filter
- `cardholder` (optional) - Cardholder filter
- `merchantId` (optional) - Merchant ID filter
- `currency` (optional) - Currency filter
- `orderNumber` (optional) - Order number filter
- `recTradeId` (optional) - Transaction ID filter

## Error Handling

```typescript
import { TapPayError } from 'tappay-ng';

try {
  const response = await client.payByPrime({
    // ... params
  });
} catch (error) {
  const tapPayError = error as TapPayError;
  console.error('Error status:', tapPayError.status);
  console.error('Error message:', tapPayError.msg);
}
```

## TypeScript Support

This package includes full TypeScript type definitions. All request and response types are exported:

```typescript
import {
  TapPayClient,
  TapPayConfig,
  PayByPrimeResponse,
  PayByCardTokenResponse,
  RefundResponse,
  RecordResponse,
  Cardholder,
  Currency,
  TapPayError,
} from 'tappay-ng';
```

## Security Notes

- Never expose your `partnerKey` in client-side code
- Always validate payment results on your backend
- Use HTTPS for all communications
- Verify 3D Secure callbacks on your backend
- Store card tokens securely and never log them

## Testing

Use sandbox environment for testing:

```typescript
const client = new TapPayClient({
  partnerId: 'YOUR_PARTNER_ID',
  partnerKey: 'YOUR_PARTNER_KEY',
  merchantId: 'YOUR_MERCHANT_ID',
  env: 'sandbox',
});
```

## License

MIT

## Links

- [TapPay Official Documentation](https://docs.tappaysdk.com/)
- [TapPay Backend API Documentation](https://docs.tappaysdk.com/tutorial/zh/back.html)

## Support

For TapPay API issues, please contact TapPay support.
For SDK issues, please open an issue on GitHub.

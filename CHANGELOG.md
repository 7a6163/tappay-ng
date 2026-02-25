# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2026-02-26

### Changed
- Corrected `InvoiceType` JSDoc: `1` is 一般稅額 (VAT, 加值型), `2` is 特種稅額 (非加值型, for financial/special industries) — not related to B2B/B2C
- Updated README `issueInvoice` example: `invoiceType` set to `1` with accurate description; `buyerIdentifier` comment clarified as the B2B indicator

## [1.2.1] - 2026-02-26

### Added
- `request-id` header support on all `EInvoiceClient` methods (`issueInvoice`, `voidInvoice`, `voidWithReissue`, `allowanceInvoice`, `queryInvoice`, `queryAllowance`) — optional field; if omitted, TapPay auto-generates one

### Changed
- Added JSDoc comments to e-invoice types (`NotifyEmail`, `InvoiceType`, `CarrierType`, `TaxType`) with Chinese descriptions matching API spec V1.4
- Fixed `CarrierType` documentation: `0` 會員載具 (default), `1` 手機條碼載具, `2` 自然人憑證載具
- Added `@note` to `InvoiceType`: mandatory and validated from 2025/6 onwards per TapPay spec

## [1.2.0] - 2026-02-09

### Added
- E-Invoice API support via new `EInvoiceClient` class (`src/einvoice_client.ts`)
- All e-invoice TypeScript interfaces and types (`src/einvoice_types.ts`)
- 6 e-invoice API methods:
  - `issueInvoice()` — Issue an e-invoice (開立發票)
  - `voidInvoice()` — Void an e-invoice (作廢發票)
  - `voidWithReissue()` — Void and reissue an e-invoice (註銷發票)
  - `allowanceInvoice()` — Create an allowance/discount (折讓)
  - `queryInvoice()` — Query invoice details (查詢發票)
  - `queryAllowance()` — Query allowance details (查詢折讓明細)
- Type exports: `EInvoiceConfig`, `EInvoiceDetail`, `EInvoiceCarrier`, `EInvoiceAllowanceDetail`, `NotifyEmail`, `InvoiceType`, `CarrierType`, `TaxType`, `PaymentType`, `EInvoiceCurrency`, `CustomsClearanceMarkEnum`, and all request/response interfaces
- Comprehensive unit and integration tests for all e-invoice endpoints

### Notes
- E-Invoice API uses a separate domain (`sandbox-invoice.tappaysdk.com` / `invoice.tappaysdk.com`)
- `EInvoiceClient` only requires `partnerKey` (no `merchantId`/`merchantGroupId` needed)
- Existing `TapPayClient` is unchanged — this is fully backward compatible

## [1.1.0] - 2026-01-25

### Added
- Support for Merchant Group ID (`merchantGroupId`) in client configuration
- `TapPayConfigError` class for configuration validation errors
- Mutual exclusivity validation between `merchantId` and `merchantGroupId`
- `merchant_group_id` field support in `PayByPrimeRequest` and `PayByCardTokenRequest`
- Comprehensive test coverage for MGID functionality including:
  - Unit tests for configuration validation
  - Integration tests for payment methods with MGID
  - Type tests for new interfaces

### Changed
- `merchantId` is now optional in `TapPayConfig` (but one of `merchantId` or `merchantGroupId` is required)
- `merchant_id` is now optional in request types when using `merchant_group_id`

### Notes
- This is a backward compatible change - existing code using `merchantId` continues to work without modifications
- When using MGID, transactions follow portal payment configuration
- Empty strings for merchant IDs are treated as missing values and will trigger validation errors

## [1.0.0] - Initial Release

### Added
- Initial implementation of TapPay SDK for Node.js
- TypeScript support with full type definitions
- Pay by Prime API
- Pay by Card Token API
- Refund API
- Transaction Query API
- Support for 3D Secure authentication
- Instalment payment support
- Delay capture functionality
- Comprehensive test suite with 100% coverage
- Minimal dependencies (zero runtime dependencies)

[1.2.0]: https://github.com/7a6163/tappay-ng/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/7a6163/tappay-ng/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/7a6163/tappay-ng/releases/tag/v1.0.0

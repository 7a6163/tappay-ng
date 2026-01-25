# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.0]: https://github.com/7a6163/tappay-ng/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/7a6163/tappay-ng/releases/tag/v1.0.0

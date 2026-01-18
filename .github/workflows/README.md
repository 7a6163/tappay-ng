# GitHub Actions Workflows

這個目錄包含了 TapPay NG 的 CI/CD 工作流程配置。

## 工作流程說明

### 1. CI Workflow (`ci.yml`)

**觸發時機：**
- 推送到 `main` 或 `develop` 分支
- Pull Request 到 `main` 或 `develop` 分支

**包含的檢查：**

#### Lint Job
- 執行 ESLint 檢查代碼品質
- 使用 Node.js 20

#### Test Job
- 在多個 Node.js 版本上測試（16, 18, 20）
- 執行測試套件並生成覆蓋率報告
- 上傳覆蓋率到 Codecov（僅在 Node.js 20）

#### Security Job
- 執行 `npm audit` 檢查依賴漏洞
- 執行 `npm audit signatures` 驗證套件簽名
- 設置為 continue-on-error，不會阻擋 PR

#### Build Job
- 依賴 lint、test 和 security jobs
- 構建 TypeScript 專案
- 檢查打包內容
- 上傳構建產物（保留 7 天）

### 2. Publish Workflow (`publish.yml`)

**觸發時機：**
- 創建 GitHub Release
- 手動觸發（workflow_dispatch）

**發布流程：**
1. 執行 lint 和 test
2. 構建專案
3. 檢查版本是否已存在於 NPM
4. 發布到 NPM（如果版本不存在）
5. 創建 Git tag
6. 創建 GitHub Release

**所需設置：**
- `NPM_TOKEN`: NPM 發布 token（需要在 GitHub Secrets 中設置）

### 3. CodeQL Security Scan (`codeql.yml`)

**觸發時機：**
- 推送到 `main` 分支
- Pull Request 到 `main` 分支
- 每週一自動執行（cron schedule）

**功能：**
- 使用 GitHub CodeQL 進行安全掃描
- 自動檢測潛在的安全漏洞
- 結果會顯示在 Security > Code scanning alerts

## 設置步驟

### 1. 啟用 GitHub Actions

確保 GitHub 倉庫的 Actions 已啟用：
- Settings > Actions > General
- 允許所有 actions 和可重用的工作流程

### 2. 設置 NPM Token

要啟用自動發布到 NPM：

1. 登入 [npmjs.com](https://www.npmjs.com/)
2. 前往 Account Settings > Access Tokens
3. 創建新的 Automation token
4. 在 GitHub 倉庫中：
   - Settings > Secrets and variables > Actions
   - 點擊 "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: 貼上你的 NPM token

### 3. 設置 Codecov（可選）

如果要使用 Codecov 進行覆蓋率追蹤：

1. 前往 [codecov.io](https://codecov.io/)
2. 使用 GitHub 登入
3. 啟用你的倉庫
4. 不需要額外配置，GitHub Actions 會自動上傳

## 使用指南

### 自動 CI 檢查

當你推送代碼或創建 PR 時，CI 會自動執行。你可以在 PR 頁面或 Actions 標籤中查看結果。

### 發布新版本

#### 方法 1：通過 GitHub Release（推薦）

1. 更新 `package.json` 中的版本號：
   ```bash
   npm version patch  # 或 minor/major
   ```

2. 推送更改和 tag：
   ```bash
   git push && git push --tags
   ```

3. 在 GitHub 上創建 Release：
   - Releases > Create a new release
   - 選擇剛才創建的 tag
   - 填寫 Release notes
   - 點擊 "Publish release"

4. GitHub Actions 會自動發布到 NPM

#### 方法 2：手動觸發

1. 前往 Actions 標籤
2. 選擇 "Publish to NPM" workflow
3. 點擊 "Run workflow"
4. 選擇分支並執行

### 查看測試覆蓋率

- 測試覆蓋率報告會在每次 CI 運行時生成
- 如果設置了 Codecov，可以在 codecov.io 查看詳細報告
- 本地執行：`npm run test:coverage`

### 安全掃描

- CodeQL 會每週自動執行
- 結果可在 Security > Code scanning alerts 中查看
- 如果發現問題，會創建 alert

## 本地測試

在推送之前，可以本地運行相同的檢查：

```bash
# Lint
npm run lint

# Test
npm run test

# Test with coverage
npm run test:coverage

# Build
npm run build

# Security audit
npm audit

# 完整檢查
npm run lint && npm test && npm run build
```

## 狀態徽章

在 README.md 中添加狀態徽章：

```markdown
[![CI](https://github.com/yourusername/tappay-ng/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/tappay-ng/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/tappay-ng.svg)](https://badge.fury.io/js/tappay-ng)
[![codecov](https://codecov.io/gh/yourusername/tappay-ng/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/tappay-ng)
```

## 疑難排解

### CI 失敗

1. 檢查錯誤日誌
2. 本地運行相同的命令
3. 確認 Node.js 版本兼容性

### 發布失敗

1. 確認 NPM_TOKEN 已正確設置
2. 檢查版本號是否已存在
3. 確認有發布權限

### 覆蓋率上傳失敗

- Codecov 上傳失敗不會導致 CI 失敗（設置為 fail_ci_if_error: false）
- 檢查 Codecov 是否正確設置

## 工作流程狀態

你可以在 GitHub 倉庫的 Actions 標籤中查看所有工作流程的執行狀態和歷史記錄。

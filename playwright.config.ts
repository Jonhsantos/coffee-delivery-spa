import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:5182', browserName: 'chromium' },
  webServer: {
    command: 'npm run dev -- --port 5182 --strictPort',
    url: 'http://127.0.0.1:5182',
    reuseExistingServer: false,
  },
})

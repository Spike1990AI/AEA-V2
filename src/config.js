// AEA V2 Configuration
// Token loaded from window at runtime (injected via index.html)

export const CONFIG = {
  // GitHub Credentials - token injected at build time
  get GITHUB_TOKEN() {
    return window.__GITHUB_TOKEN__ || '';
  },

  // Gist IDs
  TEST_GIST_ID: 'd7e23749d3bc80ca5387740bec657fea',
  LIVE_GIST_ID: '749db4248c415b5d7a3efb767e640f66',

  // PINs
  ALBA_PIN: '5678',
  PARENT_PIN: '3521',
  ADMIN_PIN: '5756',

  // App Settings
  VERSION: '2.0.0',
  APP_NAME: 'Alba Education App',
};

// Helper to get active Gist ID based on mode
export function getGistId(mode = 'live') {
  return mode === 'test' ? CONFIG.TEST_GIST_ID : CONFIG.LIVE_GIST_ID;
}

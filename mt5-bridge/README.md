# MT5 connection bridge

This repository's GitHub Pages site is static and cannot connect directly to MT5. A bridge API must run on a Windows VPS/server and the MT5 desktop terminal must remain connected.

## Safe monitoring-only setup
1. Deploy a small API server with a secret token.
2. Install a read-only MQL5 Expert Advisor in MT5 that periodically sends balance, equity, open-position count and connection status to that API.
3. Configure MT5 Tools → Options → Expert Advisors → Allow WebRequest for listed URL, adding only your own API domain.
4. Update the dashboard to read the API's status endpoint.

This bridge should be monitoring-only at first. Do not place broker passwords or secret tokens in website HTML/JavaScript. Test with a demo account. The website cannot send real orders until a separate authenticated trading API is designed and tested.
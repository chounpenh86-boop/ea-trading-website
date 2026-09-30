#property strict
#property version "1.00"
#property description "Read-only Smart EA dashboard bridge; does not place trades."

input string BridgeURL = "https://YOUR-BACKEND-DOMAIN/api/mt5/status";
input string BridgeToken = "REPLACE_WITH_LONG_RANDOM_TOKEN";
input int SendEverySeconds = 10;

int OnInit()
{
   EventSetTimer(MathMax(5, SendEverySeconds));
   SendStatus();
   return(INIT_SUCCEEDED);
}
void OnDeinit(const int reason) { EventKillTimer(); }
void OnTimer() { SendStatus(); }

void SendStatus()
{
   if(StringFind(BridgeURL, "YOUR-BACKEND-DOMAIN") >= 0 || StringFind(BridgeToken, "REPLACE_") == 0)
   {
      Print("Configure BridgeURL and BridgeToken first.");
      return;
   }
   string server = AccountInfoString(ACCOUNT_SERVER);
   string currency = AccountInfoString(ACCOUNT_CURRENCY);
   string body = StringFormat(
      "{\"accountLogin\":\"%I64d\",\"server\":\"%s\",\"currency\":\"%s\",\"balance\":%.2f,\"equity\":%.2f,\"profit\":%.2f,\"positions\":%d,\"symbol\":\"%s\",\"terminalConnected\":%s}",
      AccountInfoInteger(ACCOUNT_LOGIN), server, currency,
      AccountInfoDouble(ACCOUNT_BALANCE), AccountInfoDouble(ACCOUNT_EQUITY),
      AccountInfoDouble(ACCOUNT_PROFIT), PositionsTotal(), _Symbol,
      (bool)TerminalInfoInteger(TERMINAL_CONNECTED) ? "true" : "false"
   );
   char data[];
   StringToCharArray(body, data, 0, WHOLE_ARRAY, CP_UTF8);
   if(ArraySize(data) > 0) ArrayResize(data, ArraySize(data)-1);
   char result[];
   string headers = "Content-Type: application/json\r\nX-Bridge-Token: " + BridgeToken + "\r\n";
   string responseHeaders;
   ResetLastError();
   int code = WebRequest("POST", BridgeURL, headers, 5000, data, result, responseHeaders);
   if(code == -1)
      Print("WebRequest failed: ", GetLastError(), ". Add your backend domain to MT5 Options > Expert Advisors > Allow WebRequest.");
   else
      Print("Dashboard status sent. HTTP ", code);
}

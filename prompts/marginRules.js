module.exports = `
MARGIN & RISK RULES

--------------------------------------------------
FUTURES MARGIN
--------------------------------------------------

Trigger when the client asks:

- Futures margin
- Futures leverage
- Futures mein kitna margin hai?
- Futures leverage kitna hai?
- Intraday futures
- Carry Forward futures

Reply:

Futures Margin:

• Intraday Futures: Up to 500× margin
• Carry-Forward Futures: Up to 60× margin

Important:

Applicable margin may vary depending on:

- Trading instrument
- Account status
- Market volatility
- Risk management policies
- Platform rules

Risk Disclaimer:

Higher margin can increase both potential profit and potential loss. Please understand the associated financial risks before trading.

--------------------------------------------------
OPTION BUYING MARGIN
--------------------------------------------------

Trigger when the client asks:

- Option Buying margin
- Options margin
- Option buying leverage
- Option buying mein kitna margin hai?

Reply:

Option Buying Margin:

• Intraday: Up to 7× margin
• Carry-Forward: Up to 4× margin

Important:

- Standard option trading rules apply.
- Required account balance and eligibility conditions may apply.
- Margin availability may vary based on platform risk management.

Risk Disclaimer:

Options trading involves financial risk. Higher leverage can increase both gains and losses.

--------------------------------------------------
OPTION SELLING MARGIN
--------------------------------------------------

Trigger when the client asks:

- Option Selling margin
- Option writing
- Option selling mein kitna margin hai?

Reply:

Option Selling Margin:

• Intraday: Up to 7× margin
• Carry-Forward: Not Available

Important:

Carry-Forward Option Selling is not permitted.

Applicable margin requirements may vary depending on market conditions and platform risk management.

Risk Disclaimer:

Option Selling involves significant financial risk. Please verify applicable margin requirements before placing any trade.

--------------------------------------------------
AUTO SQUARE-OFF
--------------------------------------------------

Trigger when the client asks:

- Auto square off
- Square off kab hota hai?
- Risk rule
- Position kab close hoti hai?

Reply:

According to the current risk rules, a position may be auto square-off when approximately 90% loss condition is reached.

Please note:

- Execution depends on market liquidity.
- Price movement can affect execution.
- Slippage may occur.
- System conditions may influence execution timing.
- Exact execution price cannot be guaranteed.

If the applicable loss condition is reached, the client may also close the trade immediately.

--------------------------------------------------
GENERAL RISK DISCLAIMER
--------------------------------------------------

Trading and the use of margin involve significant financial risk.

Higher margin can increase both potential profit and potential loss.

Master Trader does not guarantee profits or protection from losses. Clients should understand all applicable trading rules, margin requirements, charges and risks before placing any trade.
`;
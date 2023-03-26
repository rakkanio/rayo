The program is intended to work as a bridge from stablecoins on XRP Ledger to Bitcoin LN in order to facilitate remittances to el Salvador. It is a proof of concept and our intention is to research deeper how to make this service available in a secure way. For now the prototypes does the following things


1) integrates with Gem Wallet fetching account details
2) It uses LNPay service to decode an bitcoin lighting network invoice
3) Uses Uphold Api to check the exchange rate
4) Uses Gem Wallet API to form a transaction
5) Uses xrpls.js to  check the status of the transaction originated on the previous step.
6) Uses LNPay Api to pay a Lightning Netwokr invoice

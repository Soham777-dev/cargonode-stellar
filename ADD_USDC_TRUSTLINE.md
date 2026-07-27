# How to Add USDC Trustline

Before you can create shipments, you need to add a trustline to the test USDC token.

## Option 1: Using Freighter Wallet (Recommended)

1. Open your Freighter wallet extension
2. Click on "Manage Assets" or "Add Asset"
3. Select "Add by Contract ID"
4. Paste the USDC contract address:
   ```
   CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5
   ```
5. Click "Add" or "Confirm"
6. You should now see USDC in your asset list with 0 balance
7. Return to CargoNode and try creating a shipment

## Option 2: Using Stellar Laboratory

1. Go to https://laboratory.stellar.org/
2. Select "Testnet" in the top right
3. Go to "Transaction Builder"
4. Enter your public key as Source Account
5. Click "Fetch next sequence number"
6. Under Operations, select "Change Trust"
7. For Asset:
   - Type: "Alphanumeric 4"
   - Code: "USDC"  
   - Issuer: Use the contract address above
8. Click "Sign in Transaction Signer"
9. Copy the XDR
10. Open Freighter and sign the transaction

## Troubleshooting

**Error: "Failed to build blockchain transaction"**
- This means your account doesn't have the USDC trustline yet
- Follow Option 1 above to add it

**Error: "Account not found"**
- Your account needs XLM first
- Click "Get Test Tokens" button on the CargoNode app

**Error: "Insufficient balance"**
- Make sure you have at least 1 XLM for fees
- Each trustline requires a 0.5 XLM reserve

## Why is this needed?

On Stellar, accounts must explicitly trust assets before they can hold them. This is a security feature that prevents spam tokens from being sent to your account.

The CargoNode app uses test USDC for shipment payments, so you need to add this trustline once before creating your first shipment.

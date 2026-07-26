# CargoNode User Onboarding Guide

> **For Level 4 Submission:** This guide helps recruit 10+ test users to validate real-world wallet interactions on Stellar testnet.

## Overview

This guide will walk you through using CargoNode, a decentralized freight logistics payment platform powered by Stellar smart contracts. You'll learn how to set up your wallet, get testnet tokens, and complete the full 6-step shipment workflow.

**Estimated Time:** 15-20 minutes

## Prerequisites

- Computer with a modern browser (Chrome, Firefox, Edge, or Brave)
- Basic understanding of blockchain wallets
- Internet connection

## Step 1: Install Freighter Wallet

Freighter is a Stellar wallet browser extension required to interact with CargoNode.

**Installation:**
1. Visit [https://www.freighter.app/](https://www.freighter.app/)
2. Click "Add to [Your Browser]"
3. Install the extension from your browser's extension store
4. Click the Freighter icon in your browser toolbar
5. Choose "Create New Wallet"
6. **CRITICAL:** Write down your 12-word recovery phrase and store it safely
7. Create a password for your wallet

**Set Network to Testnet:**
1. Open Freighter extension
2. Click the settings icon (gear)
3. Select "Preferences"
4. Under "Network," select **"Testnet"**
5. Verify you see "Testnet" in the top-right of the wallet

## Step 2: Fund Your Wallet with Testnet XLM

You need testnet XLM (Stellar Lumens) for transaction fees.

**Method 1: Using Friendbot (Recommended)**
1. Open Freighter and copy your wallet address (starts with "G...")
2. Visit [https://laboratory.stellar.org/#account-creator?network=test](https://laboratory.stellar.org/#account-creator?network=test)
3. Paste your address
4. Click "Get Test Network XLM"
5. Wait 5-10 seconds
6. Refresh your Freighter wallet - you should see 10,000 XLM

**Method 2: Using CargoNode "Get Tokens" Button**
1. Navigate to [https://cargonode-stellar.vercel.app/shipments/new](https://cargonode-stellar.vercel.app/shipments/new)
2. Connect your wallet (click "Connect Wallet" button)
3. Click "Get Tokens"
4. The app will automatically request testnet XLM for you
5. If you see "Account already has XLM" - that's fine, proceed to next step

**Verification:**
- Open Freighter
- Check your balance shows 10,000 XLM (or similar amount)

## Step 3: Get Test USDC Tokens

CargoNode uses USDC for shipment payments. You need test USDC tokens.

**Steps:**
1. Navigate to [https://cargonode-stellar.vercel.app/shipments/new](https://cargonode-stellar.vercel.app/shipments/new)
2. Click "Connect Wallet" in the top-right
3. Freighter will prompt you to connect - click "Connect"
4. Click the "Get Tokens" button
5. The app will fund your wallet with XLM and add USDC trustline
6. Wait 5-10 seconds for confirmation

**Manual Funding (If token minting doesn't work):**
- You can manually fund your wallet with test USDC
- Contact the project maintainer for test USDC tokens
- GitHub: https://github.com/Soham777-dev/cargonode-stellar

**Verification:**
- Check your Freighter wallet
- You should see XLM balance
- USDC token will be added when you create your first shipment

## Step 4: Create Your First Shipment (As Shipper)

**Scenario:** You're a shipper sending cargo and need to create an escrowed payment.

**Steps:**
1. Navigate to [https://cargonode-stellar.vercel.app/shipments/new](https://cargonode-stellar.vercel.app/shipments/new)
2. Ensure your wallet is connected (see Step 3)
3. Fill in the shipment form:
   - **Shipper Address:** Your wallet address (auto-filled)
   - **Driver Address:** Another Stellar testnet address (ask a friend or use a second wallet)
   - **Amount:** `100` (USDC)
   - **Origin:** Your city
   - **Destination:** Another city
   - **Cargo Description:** e.g., "Electronics"
   - **Cargo Weight:** e.g., `500` (kg)
4. Click "Create Shipment"
5. Freighter will prompt you to sign the transaction - **Review and confirm**
6. Wait 5-10 seconds for blockchain confirmation
7. You'll be redirected to the shipment details page
8. **Status should show: "Escrowed"** ✅

**What Just Happened:**
- 100 USDC was locked in the Soroban smart contract
- Your wallet paid a small XLM fee (~0.01 XLM)
- The shipment is now on the blockchain

## Step 5: Accept the Shipment (As Driver)

**Scenario:** You're a driver accepting a shipment.

**Steps:**
1. Open a **private/incognito browser window** (or use a different browser/device)
2. Install Freighter and create a **second wallet** (use the address you provided as "Driver Address" in Step 4)
3. Fund the second wallet with testnet XLM (see Step 2)
4. Navigate to [https://cargonode-stellar.vercel.app/shipments](https://cargonode-stellar.vercel.app/shipments)
5. Connect the **driver wallet**
6. Find your shipment in the list
7. Click on the shipment to view details
8. Click "Accept Shipment"
9. Freighter prompts you to sign - **Confirm**
10. Wait 5-10 seconds
11. **Status should change to: "Accepted"** ✅

## Step 6: Mark Shipment In Transit (As Driver)

**Steps:**
1. Stay logged in as the driver
2. On the shipment details page, click "Mark In Transit"
3. Confirm the transaction in Freighter
4. Wait for confirmation
5. **Status should change to: "In Transit"** ✅

## Step 7: Mark Shipment Delivered (As Driver)

**Steps:**
1. Stay logged in as the driver
2. On the shipment details page, click "Mark Delivered"
3. Confirm the transaction in Freighter
4. Wait for confirmation
5. **Status should change to: "Delivered"** ✅

## Step 8: Confirm Delivery (As Shipper)

**Scenario:** You're the shipper confirming delivery to release payment.

**Steps:**
1. Switch back to your **original browser/wallet** (shipper wallet)
2. Navigate to [https://cargonode-stellar.vercel.app/shipments](https://cargonode-stellar.vercel.app/shipments)
3. Click on your shipment
4. Click "Confirm Delivery"
5. Freighter prompts you to sign - **Confirm**
6. Wait 5-10 seconds
7. **Status should change to: "Completed"** ✅

**What Just Happened:**
- The smart contract released the 100 USDC to the driver's wallet
- Check the driver's wallet - it should now have 100 USDC
- The shipment is complete

## Step 9: Record Your Interaction (Important!)

For Level 4 submission validation, we need to record your interaction.

**Please provide:**
1. **Your Wallet Address:** (starts with "G...")
2. **Transaction Hash:** (find on shipment details page or in Freighter transaction history)
3. **Timestamp:** When you completed the transaction
4. **Action Performed:** (e.g., "Created shipment," "Accepted shipment," "Confirmed delivery")

**How to Find Transaction Hash:**
1. Open the shipment details page on CargoNode
2. Scroll down to "Transaction Hash" section
3. Copy the hash (starts with a long string of letters/numbers)
4. OR check Freighter → Recent Activity → Click on the transaction

**Submit Information:**
- Create a GitHub issue at: https://github.com/Soham777-dev/cargonode-stellar/issues
- Or contact via project Discord/Telegram (links in README)

## Troubleshooting

### "Wallet not connected" Error
- Ensure Freighter is installed and set to **Testnet**
- Click "Connect Wallet" button in the top-right
- Approve the connection request in Freighter
- Refresh the page if needed

### "Insufficient balance" Error
- Ensure you have enough testnet XLM for transaction fees (~1 XLM minimum)
- Ensure you have enough USDC for shipment amount
- Use "Get Tokens" button to request more XLM
- For USDC, contact project maintainer

### "Transaction failed" Error
- Check your internet connection
- Ensure Stellar testnet is operational (visit [status.stellar.org](https://status.stellar.org))
- Try refreshing the page and retrying
- Check Freighter for error messages

### "Already funded" or "Account already has XLM" Message
- Your wallet already has testnet XLM - this is fine, proceed to next step
- This means you've already used Friendbot successfully

### Cannot See Shipment
- Ensure correct wallet is connected (shipper vs driver)
- Check shipment status - some actions are only available to specific roles
- Refresh the page
- Try disconnecting and reconnecting wallet

### Freighter Not Showing USDC Balance
- Wait 30 seconds after token minting
- USDC balance will show after your first transaction
- Click "Add Asset" in Freighter and search for the USDC contract ID:
  ```
  CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5
  ```

### "Get Tokens" Button Not Working
- This is a known limitation (deployer key issue)
- Use Friendbot directly: https://laboratory.stellar.org/#account-creator?network=test
- For USDC tokens, the app will handle trustline when you create shipment

### Mobile Browser Issues
- Freighter is a desktop browser extension only
- Use desktop Chrome, Firefox, Edge, or Brave
- Mobile wallet support coming in future updates

## Support

If you encounter issues not covered here:
- Check the [GitHub Issues](https://github.com/Soham777-dev/cargonode-stellar/issues)
- Create a new issue with:
  - Error message screenshot
  - Steps you took
  - Your wallet address (public key only)
- Join our community: [Add Discord/Telegram link]

## Next Steps

After completing your first transaction:
- Try creating multiple shipments
- Test the cancellation flow (create a shipment, then click "Cancel")
- Explore the analytics dashboard at [https://cargonode-stellar.vercel.app/analytics](https://cargonode-stellar.vercel.app/analytics)
- Test on different screen sizes
- Share your feedback!

## Communication Channel

**Join our testing community:**
- **GitHub Discussions:** https://github.com/Soham777-dev/cargonode-stellar/discussions
- **GitHub Issues:** https://github.com/Soham777-dev/cargonode-stellar/issues
- **Discord:** [Add link if available]
- **Telegram:** [Add link if available]

We'll use these channels to:
- Answer questions
- Coordinate testing
- Share updates
- Collect feedback

Thank you for helping validate CargoNode! 🚀

## Testing Goals

To achieve Level 4 certification, we need:
- ✅ 10+ unique users
- ✅ Each user completes at least 1 transaction
- ✅ Verified wallet addresses recorded
- ✅ Transaction hashes recorded
- ✅ User feedback collected

Your participation helps make CargoNode production-ready!

## Complete Workflow Summary

The full CargoNode workflow has **6 steps**:

1. **Escrowed** - Shipper creates shipment, funds locked in smart contract
2. **Accepted** - Driver accepts the shipment
3. **In Transit** - Driver marks cargo picked up
4. **Delivered** - Driver marks delivery complete
5. **Confirmed** - Shipper confirms delivery
6. **Completed** - Smart contract releases payment to driver

Each step is recorded on the Stellar blockchain and visible in the transaction history.

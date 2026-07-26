# CargoNode Demo Video Script

**Duration:** 5-10 minutes  
**Format:** Screen recording with narration  
**Target Audience:** Stellar Level 4 reviewers, potential users, developers

---

## Scene 1: Introduction (30 seconds)

**[Show CargoNode homepage]**

> "Hi! I'm going to show you CargoNode, a decentralized freight logistics payment platform built on Stellar with Soroban smart contracts."

**[Hover over key features]**

> "CargoNode solves a real problem in logistics: payment trust between shippers and drivers. With smart contract escrow, shippers can lock payment upfront, and drivers get paid automatically when delivery is confirmed."

---

## Scene 2: Architecture Overview (30 seconds)

**[Show README.md architecture diagram]**

> "Here's how it works: We have a Next.js frontend deployed on Vercel, a Node.js backend on Railway with PostgreSQL, and Soroban smart contracts on Stellar testnet. Everything is live and production-ready."

**[Show URLs]**
- Frontend: https://cargonode-stellar.vercel.app/
- Backend: https://cargonode-stellar-production.up.railway.app/api
- Contract: CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH

---

## Scene 3: Wallet Connection (1 minute)

**[Show Freighter wallet extension]**

> "First, I'll connect my Freighter wallet. CargoNode uses Freighter for all blockchain interactions."

**[Click Connect Wallet button]**

> "Click Connect Wallet..."

**[Approve in Freighter]**

> "...and approve the connection. You can see my wallet address is now displayed in the top-right."

**[Show wallet address]**

> "I'm connected to Stellar testnet, and I have testnet XLM for transaction fees."

---

## Scene 4: Creating a Shipment (2 minutes)

**[Navigate to "New Shipment" page]**

> "Let's create a shipment. Click 'New Shipment'."

**[Fill in form]**

> "I'll fill in the shipment details:"
- **Shipper Address:** (auto-filled)
- **Driver Address:** (paste second wallet address)
- **Amount:** "I'm paying 100 USDC for this shipment"
- **Origin:** "Mumbai"
- **Destination:** "Delhi"
- **Cargo Description:** "Electronics - 50 laptops"
- **Weight:** "500 kg"

**[Click Create Shipment]**

> "Click 'Create Shipment'. Freighter pops up asking me to sign the transaction."

**[Show Freighter popup]**

> "This transaction will lock 100 USDC in the smart contract escrow. I'll approve it."

**[Click Approve]**

> "The transaction is submitted to the Stellar network..."

**[Show loading state]**

> "...and within 5 seconds, it's confirmed!"

**[Show shipment details page]**

> "Here's our shipment. Status is 'Escrowed' - the 100 USDC is now locked in the smart contract. You can see the transaction hash, which links to the Stellar blockchain."

---

## Scene 5: Driver Accepts Shipment (1.5 minutes)

**[Switch to incognito window or second browser]**

> "Now I'll switch to a driver's perspective. I'm opening an incognito window and connecting a different wallet."

**[Connect driver wallet]**

> "This is the driver's wallet. Let me navigate to the shipments page."

**[Show shipments list]**

> "Here's the list of available shipments. I can see the one I just created."

**[Click on shipment]**

> "Let me click on it to see details."

**[Show shipment details]**

> "As a driver, I can see the pickup and delivery locations, the cargo description, and the payment amount. This looks good, so I'll accept it."

**[Click Accept Shipment]**

> "Click 'Accept Shipment'... Freighter asks me to sign..."

**[Sign transaction]**

> "...and done! The status changed to 'Accepted'. The shipment is now assigned to me."

---

## Scene 6: In Transit & Delivered Workflow (1.5 minutes)

**[Stay as driver]**

> "Now I'm going to pick up the cargo. I'll click 'Mark In Transit'."

**[Click Mark In Transit]**

> "This records on the blockchain that I've picked up the cargo."

**[Show updated status]**

> "Status is now 'In Transit'. After I deliver the cargo, I'll mark it as delivered."

**[Click Mark Delivered]**

> "Click 'Mark Delivered'... sign the transaction... and done!"

**[Show status change]**

> "Status is now 'Delivered'. The cargo has been delivered, but I haven't been paid yet. The shipper needs to confirm delivery first."

---

## Scene 7: Confirming Delivery & Payment Release (1.5 minutes)

**[Switch back to shipper wallet]**

> "Back to the shipper's perspective. Let me refresh the shipments page."

**[Show shipment with 'Delivered' status]**

> "Great! The driver marked it as delivered. Now I need to confirm that I received the cargo."

**[Click shipment]**

> "Let me click on it..."

**[Show Confirm Delivery button]**

> "...and click 'Confirm Delivery'."

**[Sign transaction]**

> "I'll sign this final transaction... and..."

**[Show status change to Completed]**

> "Perfect! Status is 'Completed'. The smart contract just released the 100 USDC to the driver's wallet."

**[Show driver's wallet with USDC]**

> "Let me check the driver's wallet... here it is! The driver now has 100 USDC. Payment was released instantly by the smart contract - no intermediary needed."

---

## Scene 8: Mobile Responsiveness (1 minute)

**[Open DevTools, switch to mobile view]**

> "Let me show you the mobile experience. I'll open Chrome DevTools and switch to mobile view."

**[Show 320px viewport - iPhone SE]**

> "Here's what it looks like on a small phone - 320 pixels wide. Everything is responsive: the navigation, the forms, the shipment cards."

**[Scroll through page]**

> "Touch targets are properly sized, no horizontal scrolling required."

**[Switch to tablet view - 768px]**

> "On a tablet, we get a bit more space but everything still works great."

**[Switch to desktop - 1920px]**

> "And on desktop, we have the full layout with optimal spacing."

---

## Scene 9: Analytics & Monitoring (1 minute)

**[Navigate to /analytics page]**

> "CargoNode includes comprehensive monitoring. Here's the analytics dashboard showing shipment statistics."

**[Show metrics]**

> "We track total shipments, active shipments, completed transactions, and total volume processed."

**[Open new tab: /api/metrics]**

> "The backend also exposes a metrics endpoint with system health, request telemetry, database pool status, and network configuration."

**[Show metrics JSON]**

> "This gives us full observability into the production system."

---

## Scene 10: Smart Contract Verification (30 seconds)

**[Open Stellar Expert]**

> "Finally, let me show you the smart contract on Stellar Expert."

**[Navigate to contract address on stellar.expert]**

> "Here's our escrow contract deployed on testnet. You can see all the contract invocations, including the create, accept, and confirm delivery transactions we just performed."

**[Show recent transactions]**

> "Every action is recorded on the blockchain - fully transparent and auditable."

---

## Scene 11: Recap & Key Features (1 minute)

**[Show CargoNode homepage again]**

> "Let me recap what we've seen:"

**[List features]**
- ✅ **Smart Contract Escrow** - Payments locked until delivery confirmed
- ✅ **6-Step Workflow** - Escrowed → Accepted → In Transit → Delivered → Confirmed → Completed
- ✅ **Freighter Wallet Integration** - Seamless blockchain transactions
- ✅ **Mobile Responsive** - Works on all screen sizes
- ✅ **Production-Ready** - Deployed on Vercel and Railway
- ✅ **Real-Time Monitoring** - Analytics and metrics endpoints
- ✅ **Open Source** - Available on GitHub

**[Show GitHub repository]**

> "The entire project is open source on GitHub with 50+ commits, comprehensive documentation, and a complete test suite."

---

## Scene 12: Closing (30 seconds)

**[Show README]**

> "If you want to try CargoNode, check out the README for setup instructions. The user onboarding guide will walk you through creating your first shipment."

**[Show live URLs]**

> "The app is live at cargonode-stellar.vercel.app. Try it out, and feel free to contribute on GitHub."

**[End screen]**

> "Thanks for watching! CargoNode - decentralized logistics payments on Stellar."

---

## Recording Checklist

Before recording:
- [ ] Clear browser cache and cookies
- [ ] Close unnecessary browser tabs
- [ ] Set browser zoom to 100%
- [ ] Prepare two Freighter wallets (shipper and driver)
- [ ] Fund both wallets with testnet XLM
- [ ] Prepare screen recording software (OBS, Loom, QuickTime)
- [ ] Test microphone audio quality
- [ ] Write down wallet addresses and keep them handy

During recording:
- [ ] Speak clearly and at moderate pace
- [ ] Show UI elements as you mention them
- [ ] Pause briefly between scenes for editing
- [ ] Keep mouse movements smooth
- [ ] Show loading states and transaction confirmations

After recording:
- [ ] Edit for clarity and pacing
- [ ] Add intro/outro screens
- [ ] Add music (optional, low volume)
- [ ] Add captions (optional but recommended)
- [ ] Export in 1080p or 4K
- [ ] Upload to YouTube or Loom
- [ ] Add video link to README.md

## Upload Destinations

**Primary:** YouTube (unlisted or public)
- Title: "CargoNode - Decentralized Freight Logistics on Stellar"
- Description: Include project links, GitHub, contract address
- Tags: Stellar, Soroban, Blockchain, Logistics, Smart Contracts

**Alternative:** Loom
- Easier for quick recordings
- Good for submission purposes
- Can download later

**Add link to README:**
```markdown
## Demo Video

Watch a complete walkthrough: [CargoNode Demo Video](YOUR_YOUTUBE_LINK)
```

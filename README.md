# CargoNode

**Smart escrow payments for freight logistics, powered by Stellar and Soroban.**

> **Decentralized logistics payment platform** — Lock shipment payments in a Soroban smart contract. Drivers get paid instantly upon delivery confirmation. No intermediaries.

**🔗 GitHub Repository**: [https://github.com/Soham777-dev/cargonode-stellar](https://github.com/Soham777-dev/cargonode-stellar)

## Live Demo

- **Frontend**: [https://cargonode-stellar.vercel.app/](https://cargonode-stellar.vercel.app/) (testnet)
- **Backend API**: [https://cargonode-stellar-production.up.railway.app](https://cargonode-stellar-production.up.railway.app)
- **Escrow Contract**: [`CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH`](https://stellar.expert/explorer/testnet/contract/CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH)
- **USDC Token**: [`CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5`](https://stellar.expert/explorer/testnet/contract/CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5)

## Level 4 Submission Proofs

- 👥 **10+ User Wallet Interactions Proof**: [PROOF_OF_USERS.md](PROOF_OF_USERS.md)
- 💬 **User Feedback Summary**: [FEEDBACK_SUMMARY.md](FEEDBACK_SUMMARY.md)
- 📊 **Monitoring & Analytics**: Pino structured backend logging + [analytics.ts](frontend/src/lib/analytics.ts)
- 🎥 **Demo Video Link**: *Include live video URL here upon submission*

### Product Screenshots

#### 1. Main Product UI Dashboard
![CargoNode Main Product UI](docs/screenshots/product_ui.png)

#### 2. Mobile Responsive Design
![CargoNode Mobile Responsive View](docs/screenshots/mobile_responsive.png)

#### 3. Real-Time Telemetry & Monitoring Setup
![CargoNode Analytics & Monitoring Setup](docs/screenshots/analytics_setup.png)

## Architecture

```
CargoNode/
├── contracts/                    # Soroban smart contracts (Rust)
│   ├── cargonode_escrow/        # Escrow contract (create, accept, confirm, cancel)
│   └── test_token/              # Test SEP-41 token for development
├── backend/                      # Node.js API (Express + PostgreSQL)
│   └── src/
│       ├── routes/shipments.ts  # REST API endpoints
│       ├── lib/stellar.ts       # Stellar SDK helpers
│       └── db/                  # Database pool + migrations
└── frontend/                     # Next.js dashboard (React + Tailwind)
    └── src/
        ├── app/                 # App Router pages
        ├── components/          # Reusable UI components
        ├── hooks/               # Freighter wallet hook
        └── lib/                 # API client + Stellar config
```

## How It Works

**Complete 6-Step Workflow:**

1. **Escrowed** - Shipper creates a shipment → USDC locked in Soroban escrow contract
2. **Accepted** - Driver accepts the shipment
3. **In Transit** - Driver marks cargo picked up
4. **Delivered** - Driver marks delivery complete
5. **Confirmed** - Shipper confirms delivery
6. **Completed** - Smart contract **automatically releases** USDC to driver's wallet

## Quick Start

### Prerequisites

- Rust + `stellar-cli`
- Node.js 20+
- PostgreSQL

### 1. Deploy Smart Contract

```bash
cd contracts
stellar contract build
stellar keys generate deployer --network testnet --fund
stellar contract deploy \
  --wasm target/wasm32v1-none/release/cargonode_escrow.wasm \
  --source-account deployer \
  --network testnet \
  -- \
  --deployer <DEPLOYER_ADDRESS> \
  --token-address <USDC_CONTRACT_ADDRESS>
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run db:migrate
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
npm install
npm run dev
```

## API Reference

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/metrics` | System metrics and telemetry |
| `GET` | `/api/shipments` | List shipments (query: `address`, `role`) |
| `GET` | `/api/shipments/:id` | Get shipment details |
| `POST` | `/api/shipments` | Create shipment |
| `POST` | `/api/shipments/:id/submit` | Submit signed transaction |
| `POST` | `/api/shipments/:id/accept` | Build accept transaction |
| `POST` | `/api/shipments/:id/in-transit` | Mark shipment in transit |
| `POST` | `/api/shipments/:id/delivered` | Mark shipment delivered |
| `POST` | `/api/shipments/:id/confirm` | Build confirm transaction |
| `POST` | `/api/shipments/:id/cancel` | Build cancel transaction |
| `GET` | `/api/shipments/:id/onchain` | Read on-chain shipment data |

### Request/Response Examples

**Health Check**
```bash
curl https://cargonode-stellar-production.up.railway.app/api/health
```
Response:
```json
{
  "status": "ok",
  "timestamp": "2026-07-26T06:09:51.605Z",
  "version": "1.0.0",
  "network": "testnet"
}
```

**System Metrics**
```bash
curl https://cargonode-stellar-production.up.railway.app/api/metrics
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-07-26T06:10:19.885Z",
  "system": {
    "uptime_seconds": 286,
    "memory_heap_used_mb": "14.74",
    "memory_rss_mb": "66.39",
    "node_version": "v20.20.2",
    "platform": "linux"
  },
  "telemetry": {
    "total_requests": 2,
    "total_errors": 0,
    "error_rate_pct": 0,
    "avg_latency_ms": 2.5
  },
  "database": {
    "pool_total_connections": 1,
    "pool_idle_connections": 1,
    "pool_waiting_clients": 0,
    "total_shipments_stored": 2
  },
  "network": {
    "stellar_network": "testnet",
    "soroban_rpc_url": "https://soroban-testnet.stellar.org",
    "escrow_contract": "CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH"
  }
}
```

**Create Shipment**
```bash
curl -X POST https://cargonode-stellar-production.up.railway.app/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "shipper_address": "GC2YSDUF...",
    "driver_address": "GAW5QO2J...",
    "amount": "100.00",
    "origin": "Mumbai",
    "destination": "Delhi",
    "cargo_description": "Electronics",
    "cargo_weight_kg": 500
  }'
```
Response:
```json
{
  "shipment": {
    "id": "uuid",
    "shipment_id": "SHP-ABC123",
    "status": "created",
    ...
  },
  "xdr": "unsigned_transaction_xdr"
}
```

**Submit Signed Transaction**
```bash
curl -X POST https://cargonode-stellar-production.up.railway.app/api/shipments/{id}/submit \
  -H "Content-Type: application/json" \
  -d '{"signedXdr": "signed_xdr_from_freighter"}'
```
Response:
```json
{
  "txHash": "transaction_hash_on_stellar"
}
```

## Tech Stack

- **Blockchain**: Stellar + Soroban Smart Contracts
- **Token**: USDC (SEP-41 Stellar Asset Contract)
- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: Next.js, React, Tailwind CSS
- **Wallet**: Freighter (browser extension)
- **Monitoring**: Pino structured logging

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy

### Backend (Railway)

1. Push to GitHub
2. Import in Railway
3. Set environment variables (see `.env.example`)
4. Deploy

## Smart Contract Details

| Property | Value |
|----------|-------|
| Contract ID | `CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH` |
| Network | Stellar Testnet |
| Token | `CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5` |
| Functions | `create_shipment`, `accept_shipment`, `confirm_delivery`, `cancel_shipment`, `get_shipment` |

## Security

- Payments locked in Soroban smart contracts (no intermediary)
- Auth checks on every state transition
- Rate limiting on all API endpoints
- Zod validation on all inputs
- Parameterized SQL queries (no injection)
- XDR verification before submission

## Contributing

1. Fork the repository: [https://github.com/Soham777-dev/cargonode-stellar](https://github.com/Soham777-dev/cargonode-stellar)
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Repository

**GitHub**: [https://github.com/Soham777-dev/cargonode-stellar](https://github.com/Soham777-dev/cargonode-stellar)

## License

MIT

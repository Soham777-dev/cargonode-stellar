"use client";

import { useState } from "react";
import { useFreighter } from "@/hooks/useFreighter";
import { ConnectButton } from "@/components/ConnectButton";
import * as StellarSdk from "@stellar/stellar-sdk";

const USDC_CONTRACT = "CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const HORIZON_URL = "https://horizon-testnet.stellar.org";

export default function SetupTokenPage() {
  const { connected, address, sign } = useFreighter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addTrustline = async () => {
    if (!connected || !address) return;

    setLoading(true);
    setStatus("Building trustline transaction...");
    setError(null);
    setSuccess(false);

    try {
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const account = await server.loadAccount(address);

      // Build change trust operation for the USDC SAC
      const contract = new StellarSdk.Contract(USDC_CONTRACT);
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(
              "USDC:" + USDC_CONTRACT
            ),
          })
        )
        .setTimeout(180)
        .build();

      setStatus("Please sign the transaction in Freighter...");
      
      const xdr = transaction.toXDR();
      const signedXdr = await sign(xdr);

      setStatus("Submitting to Stellar network...");

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK_PASSPHRASE
      );

      const result = await server.submitTransaction(signedTx as StellarSdk.Transaction);

      setStatus(`Success! Transaction hash: ${result.hash.slice(0, 12)}...`);
      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/shipments/new";
      }, 3000);
    } catch (err: any) {
      console.error("Trustline error:", err);
      setError(err.message || "Failed to add trustline");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold text-secondary mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 mb-6">
          Connect your wallet to add USDC trustline
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2">
          Add USDC Trustline
        </h1>
        <p className="text-gray-600">
          Before creating shipments, you need to add a trustline to the test USDC token
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What is a trustline?</h3>
        <p className="text-sm text-blue-800 mb-4">
          On Stellar, accounts must explicitly trust assets before they can hold them.
          This is a security feature that prevents spam tokens.
        </p>
        <div className="text-sm text-blue-700">
          <p className="mb-1"><strong>Token:</strong> Test USDC</p>
          <p className="mb-1 font-mono text-xs break-all">
            <strong>Contract:</strong> {USDC_CONTRACT}
          </p>
          <p><strong>Cost:</strong> ~0.5 XLM reserve (refundable if you remove the trustline)</p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={addTrustline}
          disabled={loading || success}
          className="btn-primary w-full"
        >
          {loading ? "Processing..." : success ? "✓ Trustline Added!" : "Add USDC Trustline"}
        </button>

        {status && (
          <div className={`p-4 rounded-lg text-sm ${
            success 
              ? "bg-green-50 text-green-700" 
              : "bg-blue-50 text-blue-700"
          }`}>
            {status}
            {success && (
              <p className="text-xs mt-2">Redirecting to create shipment...</p>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {!success && (
          <div className="text-sm text-gray-600 text-center">
            Already have the trustline?{" "}
            <a href="/shipments/new" className="text-primary hover:underline">
              Create shipment →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

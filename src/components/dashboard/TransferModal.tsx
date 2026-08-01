"use client";

import { useState, useEffect } from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TransferModal({ open, onClose }: Props) {
  const [from, setFrom] = useState<"spot" | "futures">("spot");
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (open) {
      fetchWallet();
      setMessage(null);
      setAmount("");
    }
  }, [open]);

  const fetchWallet = async () => {
    try {
      const data = await apiRequest("/wallet");
      setWalletData(data);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    }
  };

  const handleSwap = () => {
    setFrom(from === "spot" ? "futures" : "spot");
  };

  const to = from === "spot" ? "futures" : "spot";

  const getAvailableBalance = () => {
    if (!walletData) return 0;
    const balances = from === "spot" ? (walletData.balances || []) : (walletData.futuresBalances || []);
    const match = balances.find((b: any) => b.asset === asset);
    return match ? match.amount : 0;
  };

  const available = getAvailableBalance();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount' });
      return;
    }
    if (parseFloat(amount) > available) {
      setMessage({ type: 'error', text: 'Insufficient balance' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await apiRequest("/wallet/transfer", {
        method: "POST",
        body: JSON.stringify({
          from,
          to,
          asset,
          amount: parseFloat(amount)
        })
      });
      setMessage({ type: 'success', text: 'Transfer successful' });
      fetchWallet();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Transfer failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-md shadow-lg border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Transfer Funds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="p-5 space-y-6">
          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {message.text}
            </div>
          )}

          <div className="relative flex flex-col gap-3">
            {/* From */}
            <div className="bg-[#242424] rounded-lg p-3">
              <span className="text-xs text-gray-400 block mb-1">From</span>
              <div className="text-white font-medium capitalize">{from} Account</div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#333] border-4 border-[#181818] p-1.5 rounded-full hover:bg-[#444] text-white transition-colors z-10"
            >
              <ArrowRightLeft size={14} className="rotate-90" />
            </button>

            {/* To */}
            <div className="bg-[#242424] rounded-lg p-3">
              <span className="text-xs text-gray-400 block mb-1">To</span>
              <div className="text-white font-medium capitalize">{to} Account</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Coin</label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full bg-[#242424] text-white rounded-lg p-3 border-none outline-none ring-1 ring-white/5 focus:ring-[#0055FF]"
            >
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm text-gray-400">Amount</label>
              <span className="text-xs text-gray-500">Available: {available.toFixed(4)} {asset}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#242424] text-white rounded-lg p-3 pr-16 border-none outline-none ring-1 ring-white/5 focus:ring-[#0055FF]"
              />
              <button
                type="button"
                onClick={() => setAmount(available.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0055FF] text-sm font-medium hover:text-[#3377FF]"
              >
                MAX
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0055FF] text-white font-semibold py-3 rounded-lg hover:bg-[#0044CC] disabled:opacity-50 transition-colors"
          >
            {loading ? "Transferring..." : "Confirm Transfer"}
          </button>
        </form>
      </div>
    </div>
  );
}

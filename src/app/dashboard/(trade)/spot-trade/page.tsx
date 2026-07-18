"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderBook from '@/components/trading/spot-trading/OrderBook';
import TradeForm from '@/components/trading/spot-trading/TradeForm';
import OrderTabs from '@/components/trading/spot-trading/TradingFooter';
import TradingChart from '@/components/trading/spot-trading/TradingChart';
import { apiRequest } from '@/lib/api';

function TradingPageContent() {
  // 1. Manage the active view state here
  const [activeTab, setActiveTab] = useState<"chart" | "info">("chart");
  const searchParams = useSearchParams();
  const assetParam = searchParams?.get('asset') || 'BTC/USDT';
  const quoteParam = searchParams?.get('quote') || 'USDT';
  const [marketInfo, setMarketInfo] = useState<any>(null);

  // Poll crypto prices via REST every 15s
  useEffect(() => {
    const assetBase = assetParam.split('/')[0];
    const fetchPrice = async () => {
      try {
        const data = await apiRequest('/market/prices');
        if (data && data[assetBase]) {
          setMarketInfo(data[assetBase]);
        }
      } catch {}
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, [assetParam]);

  return (
    <div className="bg-[#181818] px-2 h-full text-gray-300 font-manrope">
      
      {/* Header Section */}
      <div className="flex items-center gap-4 md:px-4 px-6 md:py-4 py-2 border-b border-white/5 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-2 min-w-fit">
          <img
            src={`https://cryptologos.cc/logos/${assetParam.split('/')[0].toLowerCase()}-${assetParam.split('/')[0].toLowerCase()}-logo.png`}
            className="md:w-8 md:h-8 w-6 h-6"
            alt={assetParam.split('/')[0].toLowerCase()}
          />
          <div className='flex flex-col'>
            <span className="text-white md:text-md text-sm tracking-tight font-bold">{assetParam}</span>
            <span className="text-[12px] text-gray-500">{assetParam.split('/')[0]}</span>
          </div>
        </div>
        <div className="flex gap-4 font-semibold text-[11px]">
          <div>
            <p className="text-[#ef5350] md:text-lg text-sm font-bold">{marketInfo?.usd?.toLocaleString() || '0.00'}</p>
            <p className="text-gray-500 text-[12px]">${marketInfo?.usd?.toLocaleString() || '0.00'}</p>
          </div>
          <div>
            <p className="text-gray-500 md:text-[12px] text-[10px]">24h Change</p>
            <p className="text-white text-sm">{marketInfo?.change24h?.toFixed(2) || '0.00'}%</p>
          </div>
          <div className="">
            <p className="text-gray-500 md:text-[12px] text-[10px]">24h High</p>
            <p className="text-white text-sm font-medium">{marketInfo?.high24h || '0.00'}</p>
          </div>
          <div className="">
            <p className="text-gray-500 md:text-[12px] text-[10px]">24h Low</p>
            <p className="text-white text-sm font-medium">{marketInfo?.low24h || '0.00'}</p>
          </div>
          <div className="">
            <p className="text-gray-500 md:text-[12px] text-[9px]">24hvol({assetParam.split('/')[0]})</p>
            <p className="text-white text-sm font-medium">{marketInfo?.volume24h?.toLocaleString() || '0'}</p>
          </div>
          <div className="">
            <p className="text-gray-500 md:text-[12px] text-[9px]">24hvol({quoteParam})</p>
            <p className="text-white text-sm font-medium">{marketInfo?.volume24h?.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full gap-px bg-white/5">
        <div className="grow flex flex-col min-w-0 bg-[#181818]">
          {/* 2. FUNCTIONAL BUTTONS */}
          <div className="flex items-center gap-4 px-4 md:py-3 py-2 border-b border-white/5 text-[12px] font-semibold">
            <span 
              onClick={() => setActiveTab("chart")}
              className={`pb-1 !cursor-pointer transition-all ${activeTab === "chart" ? "text-[#00B595] border-b-2 border-[#00B595]" : "text-gray-500 hover:text-white"}`}
            >
              Chart
            </span>
            <span 
              onClick={() => setActiveTab("info")}
              className={`pb-1 !cursor-pointer transition-all ${activeTab === "info" ? "text-[#00B595] border-b-2 border-[#00B595]" : "text-gray-500 hover:text-white"}`}
            >
              Info
            </span>
          </div>

          <div className="h-137.5">
            {/* 3. Pass state to the TradingChart component */}
            <TradingChart activeView={activeTab} symbol={assetParam} />
          </div>
        </div>

        <OrderBook />
        <TradeForm symbol={assetParam} />
      </div>

      <OrderTabs />
    </div>
  );
}

export default function TradingPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#181818] flex items-center justify-center text-gray-500">Loading trading terminal...</div>}>
      <TradingPageContent />
    </Suspense>
  );
}
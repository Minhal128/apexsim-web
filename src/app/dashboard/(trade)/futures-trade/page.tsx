"use client";
import React from 'react';

import OrderBook from '@/components/trading/futures-trading/FutureTradingBook';
import TradeForm from '@/components/trading/futures-trading/FutureTradingForm';
import OrderTabs from '@/components/trading/futures-trading/FutureTradingFooter';
import TradingChart from '@/components/trading/futures-trading/FutureTradingChart';

export default function FutureTradingPage() {
  return (
    <div className="bg-[#181818] min-h-screen text-gray-300 font-manrope overflow-x-hidden">
      
      <div className="flex items-center justify-between gap-4 md:px-4 px-4 md:py-5 py-3 border-b border-white/5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2 min-w-fit cursor-pointer">
            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" className="md:w-6 md:h-6 w-5 h-5" alt="btc" />
            <div className='flex items-center gap-1 whitespace-nowrap'>
              <span className="text-white md:text-[16px] text-sm font-bold">BTC /USDT</span>
              <span className="text-[12px] text-gray-500 font-medium ml-1">Bitcoin</span>
            </div>
          </div>

          <div className="flex gap-6 items-center shrink-0">
            <div className="whitespace-nowrap">
              <p className="text-[#ef5350] text-[16px] font-bold">88,200.84</p>
              <p className="text-gray-500 text-[11px] font-medium">$8,383,645</p>
            </div>
            <div className="whitespace-nowrap">
              <p className="text-gray-500 text-[11px]">24h Change</p>
              <p className="text-white text-[13px] font-medium">$88,200.84</p>
            </div>
            <div className="whitespace-nowrap">
              <p className="text-gray-500 text-[11px]">24h High</p>
              <p className="text-white text-[13px] font-medium">89,120.00</p>
            </div>
            <div className="whitespace-nowrap">
              <p className="text-gray-500 text-[11px]">24h Low</p>
              <p className="text-white text-[13px] font-medium">87,400.00</p>
            </div>
            <div className="whitespace-nowrap">
              <p className="text-gray-500 text-[11px]">24h Vol (BTC)</p>
              <p className="text-white text-[13px] font-medium">100.78K</p>
            </div>
            <div className="whitespace-nowrap">
              <p className="text-gray-500 text-[11px]">24h Vol (USDT)</p>
              <p className="text-white text-[13px] font-medium">100B</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:pr-20 shrink-0">
          <div className="bg-[#262629]/50 px-4 py-2 rounded flex items-center gap-6 border border-white/5 whitespace-nowrap">
            <div className="flex flex-col cursor-pointer"><span className="text-gray-500 text-[10px]">Total Balance</span><span className="text-white text-[15px] font-bold">$40,000.89</span></div>
            <div className="flex flex-col border-l border-white/10 pl-4 cursor-pointer"><span className="text-gray-500 text-[10px]">Equity</span><span className="text-white text-[15px] font-bold">$5,000.00</span></div>
            <div className="flex flex-col border-l border-white/10 pl-4 cursor-pointer"><span className="text-gray-500 text-[10px]">Margin Used</span><span className="text-white text-[15px] font-bold">$2000</span></div>
             <div className="flex flex-col border-l border-white/10 pl-4 cursor-pointer"><span className="text-gray-500 text-[10px]">Margin Level</span><span className="text-white text-[15px] font-bold">250%</span></div>
            <div className="flex flex-col border-l border-white/10 pl-4 cursor-pointer"><span className="text-gray-500 text-[10px]">Pnl</span><span className="text-[#0088FF] text-[15px] font-bold">+$2,100.00</span></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full md:overflow-y-auto lg:overflow-visible">
        
        <div className="flex flex-col flex-1 min-w-0">
          
          <div className="flex flex-col lg:flex-row border-b border-white/5">
            {/* Chart Area */}
            <div className="grow flex flex-col min-w-0 bg-[#181818] lg:border-r border-white/5 order-1">
              <div className="flex items-center gap-4 px-4 md:py-3 py-2 border-b border-white/5 text-[12px] font-semibold">
                <span className="text-[#00B595] border-b-2 border-[#00B595] pb-1 cursor-pointer">Chart</span>
                <span className="text-gray-500 cursor-pointer hover:text-white transition-colors">Info</span>
              </div>
              <div className="h-100 md:h-137.5">
                <TradingChart />
              </div>
            </div>

            <div className="w-full md:w-[320px] shrink-0 border-b md:border-b-0 lg:border-r border-white/5 order-2">
              <OrderBook />
            </div>
          </div>

          <div className="w-full lg:hidden mt-35 order-3 bg-[#181818] border-b border-white/5">
            <TradeForm />
          </div>

          <div className="w-full order-last md:order-0">
            <OrderTabs />
          </div>
        </div>

        <div className="hidden md:block w-[320px] shrink-0 bg-[#181818] border-l border-white/5">
          <TradeForm />
        </div>

      </div>
    </div>
  );
}
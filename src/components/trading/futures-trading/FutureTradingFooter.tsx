"use client";
import React, { useState } from 'react';
import { FaCaretDown } from "react-icons/fa";

export default function FutureTradingFooter() {
  const [activeTab, setActiveTab] = useState("Open orders (0)");

  const tabs = ['Open orders (0)', 'Orders history', 'Trade history', 'Iceberg', 'Funds'];
  const columns = ['Date', 'Pair', 'Type', 'Side', 'Price', 'Amount', 'Filled', 'Total', 'Trigger condition'];

  return (
    <div className="bg-[#181818] border-t border-white/5 min-h-100 flex flex-col font-sans w-full relative">

      <div className="flex items-center justify-between border-b border-white/5 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-6 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-[14px] font-medium transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#00B595]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar cursor-pointer">
        <div className="min-w-250 w-full">
          <div className="grid grid-cols-10 px-4 py-2 items-center">
            {columns.map((col) => (
              <div key={col} className="text-gray-500 text-[15px] font-semibold flex items-center py-3">
                {col}
                {col === 'Type' && (
                  <FaCaretDown size={12} className='pl-1.5' />
                )}
              </div>
            ))}
            
            <div className="flex md:ml-1 justify-end">
              <button className="bg-[#2B2E33] hover:bg-[#363A40] text-white text-[12px] px-8 py-1.5 rounded-[3px] transition-colors cursor-pointer whitespace-nowrap border border-white/5">
                Cancel all
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grow flex flex-col items-center justify-center p-10">
        <div className="relative w-25 h-25">
          <img
            src="/images/search.png"
            className="w-full h-full object-contain"
            alt="No data"
          />              
        </div>
        <p className="text-gray-400 text-sm mt-2">No recent deposits or trades</p>
      </div>

    </div>
  );
}
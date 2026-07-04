"use client";
import React from 'react';
import { FaCaretDown } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuSettings2 } from "react-icons/lu";
import { useState } from 'react';

const ORDER_DATA = [
    { price: 19967.98, amount: "0.10016", total: "1,999.99288", depth: 20, type: 'sell' },
    { price: 19967.69, amount: "0.00100", total: "19.96769", depth: 2, type: 'sell' },
    { price: 19967.66, amount: "0.00066", total: "13.17866", depth: 2, type: 'sell' },
    { price: 19967.61, amount: "0.27769", total: "5,544.80562", depth: 40, type: 'sell' },
    { price: 19967.60, amount: "0.01961", total: "391.56464", depth: 8, type: 'sell' },
    { price: 19967.59, amount: "0.73579", total: "14,691.95305", depth: 90, type: 'sell' },
    { price: 19967.58, amount: "0.09455", total: "1,887.93469", depth: 15, type: 'sell' },
    { price: 19967.57, amount: "0.05009", total: "1,000.17558", depth: 10, type: 'sell' },
    { price: 19967.56, amount: "0.10016", total: "1,999.95081", depth: 20, type: 'sell' },
    { price: 19967.43, amount: "0.02000", total: "399.34860", depth: 5, type: 'sell' },
    { price: 19967.42, amount: "0.16787", total: "3,351.93080", depth: 25, type: 'sell' },
    { price: 19967.36, amount: "0.04000", total: "798.69440", depth: 8, type: 'sell' },
    { price: 19967.11, amount: "0.00130", total: "25.95724", depth: 2, type: 'sell' },
    { price: 19967.10, amount: "0.18559", total: "3,705.69409", depth: 30, type: 'sell' },
    { price: 19966.99, amount: "0.00200", total: "39.93398", depth: 5, type: 'buy' },
    { price: 19966.98, amount: "0.52856", total: "10,553.74695", depth: 70, type: 'buy' },
    { price: 19966.56, amount: "0.00066", total: "13.17793", depth: 2, type: 'buy' },
    { price: 19966.52, amount: "0.00250", total: "49.91630", depth: 4, type: 'buy' },
    { price: 19966.52, amount: "0.00250", total: "49.91630", depth: 4, type: 'buy' },
    { price: 19966.52, amount: "0.00250", total: "49.91630", depth: 4, type: 'buy' },
    { price: 19966.52, amount: "0.00250", total: "49.91630", depth: 4, type: 'buy' },
    { price: 19966.52, amount: "0.00250", total: "49.91630", depth: 4, type: 'buy' },
    { price: 19966.52, amount: "0.00250", total: "49.91630", depth: 4, type: 'buy' },
];

export default function FutureTradingBook() {
    const [activeTab, setActiveTab] = useState<'Order books' | 'Last trades'>('Order books');
    
    return (
        <div className="w-full md:w-[320px] flex flex-col bg-[#181818] border-x border-white/5 h-full md:h-137.5 select-none">
          
            <div className="flex items-center justify-between px-3 h-10 shrink-0 border-b border-white/5">
                <div className="flex gap-4 h-full items-center">
                    <div
                        onClick={() => setActiveTab('Order books')}
                        className="relative h-full flex items-center cursor-pointer group"
                    >
                        <span className={`text-[12px] md:text-[13px] font-medium transition-colors ${activeTab === 'Order books' ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                            Order books
                        </span>
                        {activeTab === 'Order books' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00B595]" />
                        )}
                    </div>

                    <div
                        onClick={() => setActiveTab('Last trades')}
                        className="relative h-full flex items-center cursor-pointer group"
                    >
                        <span className={`text-[12px] md:text-[13px] font-medium transition-colors ${activeTab === 'Last trades' ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                            Last trades
                        </span>
                        {activeTab === 'Last trades' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00B595]" />
                        )}
                    </div>
                </div>
                <LuSettings2 size={16} className="text-gray-400 cursor-pointer hover:text-white" />
            </div>

            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-3.5">
                    <svg width="14" height="14" viewBox="0 0 16 16" className="text-[#00B595] cursor-pointer">
                        <rect x="2" y="2" width="5" height="5" fill="currentColor" rx="0.5" />
                        <rect x="9" y="2" width="5" height="5" fill="currentColor" rx="0.5" />
                        <rect x="2" y="9" width="5" height="5" fill="currentColor" rx="0.5" opacity="0.5" />
                        <rect x="9" y="9" width="5" height="5" fill="currentColor" rx="0.5" opacity="0.5" />
                    </svg>
                    <svg width="14" height="14" viewBox="0 0 16 16" className="text-gray-600 cursor-pointer hover:text-gray-400">
                        <rect x="2" y="2" width="12" height="5" fill="currentColor" rx="0.5" />
                        <rect x="2" y="9" width="12" height="5" fill="currentColor" rx="0.5" opacity="0.5" />
                    </svg>
                    <svg width="14" height="14" viewBox="0 0 16 16" className="text-gray-600 cursor-pointer hover:text-gray-400">
                        <rect x="2" y="2" width="12" height="5" fill="currentColor" rx="0.5" opacity="0.5" />
                        <rect x="2" y="9" width="12" height="5" fill="currentColor" rx="0.5" />
                    </svg>
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="bg-[#24262b] pl-2 pr-1.5 py-0.5 rounded flex items-center gap-3 cursor-pointer hover:bg-[#2d3036] border border-white/5">
                        <span className="text-[10px] text-gray-300">0.01</span>
                        <FaCaretDown size={10} className="text-gray-500" />
                    </div>
                    <BsThreeDotsVertical className="text-gray-500 cursor-pointer hover:text-white" size={14} />
                </div>
            </div>

            <div className="grid grid-cols-3 text-[10px] text-gray-500 px-3 pb-1 font-medium border-b border-white/5 lg:border-none">
                <span>Price(USDT)</span>
                <span className="text-right">Amount(BTC)</span>
                <span className="text-right">Total</span>
            </div>

            <div className="grow no-scrollbar pb-2 max-h-100 md:max-h-none">
                {ORDER_DATA.map((item, i) => (
                    <div
                        key={i}
                        className={`relative grid grid-cols-3 text-[11px] py-0.75 px-3 hover:bg-white/5 cursor-pointer group ${
                            item.type === 'buy' && ORDER_DATA[i-1]?.type === 'sell' ? 'mt-2 border-t border-white/5 pt-2' : ''
                        }`}
                    >
                        <div
                            className={`absolute right-0 top-0 h-full transition-all duration-300 ${
                                item.type === 'sell' ? 'bg-[#ef5350]/10' : 'bg-[#26a69a]/10'
                            }`}
                            style={{ width: `${item.depth}%` }}
                        />

                        <span className={`font-medium z-10 ${item.type === 'sell' ? 'text-[#ef5350]' : 'text-[#26a69a]'}`}>
                            {item.price.toFixed(2)}
                        </span>

                        <span className="text-right text-[#c9ccd0] z-10 font-medium tracking-tight">
                            {item.amount}
                        </span>

                        <span className="text-right text-[#848e9c] z-10 font-medium tabular-nums">
                            {item.total}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
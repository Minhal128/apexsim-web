"use client";
import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type CalcTab = "Profit/ loss" | "Target Price" | "Liquidation price";
type Side = "long" | "short";

export default function TradingCalculator({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<CalcTab>("Profit/ loss");
  const [side, setSide] = useState<Side>("long");
  
  // Inputs
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [leverage, setLeverage] = useState<number>(10);
  const [roi, setRoi] = useState<string>('');
  const [marginBalance, setMarginBalance] = useState<string>('');

  // Results
  const [resultInitialMargin, setResultInitialMargin] = useState<number>(0);
  const [resultPnL, setResultPnL] = useState<number>(0);
  const [resultROI, setResultROI] = useState<number>(0);
  const [resultTargetPrice, setResultTargetPrice] = useState<number>(0);
  const [resultLiquidationPrice, setResultLiquidationPrice] = useState<number>(0);

  if (!isOpen) return null;

  const calculateResults = () => {
    const ep = parseFloat(entryPrice) || 0;
    const tp = parseFloat(targetPrice) || 0;
    const sz = parseFloat(size) || 0;
    const lev = leverage || 1;
    const r = parseFloat(roi) || 0;
    const mb = parseFloat(marginBalance) || 0;

    if (activeTab === "Profit/ loss") {
      const initialMargin = (ep * sz) / lev;
      let pnl = 0;
      if (side === "long") {
        pnl = (tp - ep) * sz;
      } else {
        pnl = (ep - tp) * sz;
      }
      const calculatedRoi = initialMargin > 0 ? (pnl / initialMargin) * 100 : 0;
      
      setResultInitialMargin(initialMargin);
      setResultPnL(pnl);
      setResultROI(calculatedRoi);
    } 
    else if (activeTab === "Target Price") {
      // We want to find TP given ROI
      // ROI = (PnL / InitialMargin) * 100
      // PnL = (ROI / 100) * InitialMargin
      const initialMargin = (ep * sz) / lev;
      const targetPnL = (r / 100) * initialMargin;
      
      let calcTp = 0;
      if (side === "long") {
        // targetPnL = (calcTp - ep) * sz
        calcTp = (targetPnL / sz) + ep;
      } else {
        // targetPnL = (ep - calcTp) * sz
        calcTp = ep - (targetPnL / sz);
      }
      setResultTargetPrice(calcTp || 0);
    }
    else if (activeTab === "Liquidation price") {
      // Isolated Liquidation Price formula approx:
      // Long: LiqPrice = EntryPrice - (MarginBalance / Size) + (MaintenanceMargin / Size)
      // Ignoring Maintenance Margin for simplicity (assuming 0)
      let liqPrice = 0;
      if (sz > 0) {
        if (side === "long") {
          liqPrice = ep - (mb / sz);
        } else {
          liqPrice = ep + (mb / sz);
        }
      }
      // Cannot be less than 0
      setResultLiquidationPrice(Math.max(0, liqPrice));
    }
  };

  const handleLeverageClick = (val: number) => {
    setLeverage(val);
  };

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center md:justify-end justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#09090D] md:top-3 md:absolute w-full max-w-100 overflow-hidden shadow-2xl rounded-lg border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="relative border-b border-white/10 px-4">
          <div className="flex gap-6">
            {(["Profit/ loss", "Target Price", "Liquidation price"] as CalcTab[]).map((tab) => (
              <div
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // Reset inputs
                  setEntryPrice('');
                  setTargetPrice('');
                  setSize('');
                  setRoi('');
                  setMarginBalance('');
                }}
                className={`pb-2 text-[13px] font-semibold cursor-pointer transition-all relative z-10 mt-3 ${
                  activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute -bottom-px left-0 w-full h-0.5 bg-[#00B595] shadow-[0_0_8px_rgba(0,181,149,0.4)]" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-5">
          <div className="flex bg-[#1e2023] rounded-md overflow-hidden ">
            <button
              onClick={() => setSide('long')}
              className={`flex-1 py-2 text-sm rounded cursor-pointer transition-all ${
                side === 'long' ? 'bg-[#0ECB81] text-white' : 'text-gray-400 '
              }`}
            >Open Long</button>
            <button
              onClick={() => setSide('short')}
              className={`flex-1 py-2 text-sm  rounded cursor-pointer transition-all ${
                side === 'short' ? 'bg-[#FF383C] text-white' : 'text-gray-400'
              }`}
            >Open Short</button>
          </div>

          <div className="pt-2">
             <div className="relative h-1 flex items-center mb-6">
               <div className="absolute w-full h-0.5 bg-[#2d3036]" />
               
               <div className="absolute w-full flex justify-between z-10 px-0.5">
                 {[1, 15, 30, 45, 60, 75].map((val) => (
                   <div key={val} className="flex flex-col items-center relative" onClick={() => handleLeverageClick(val)}>
                     <div className={`w-3 h-3 rotate-45 border-2 transform translate-y-[-2px] cursor-pointer hover:border-[#00B595] ${
                        leverage >= val ? 'bg-[#09090D] border-[#00B595]' : 'bg-[#09090D] border-[#2d3036]'
                      }`} />
                     {/* Label */}
                     <span className="absolute top-4 text-[11px] text-gray-500 whitespace-nowrap">{val}x</span>
                   </div>
                 ))}
               </div>
             </div>
             {/* Custom Leverage Input */}
             <div className="flex justify-between items-center mt-6">
               <label className="text-[12px] text-gray-400">Leverage</label>
               <div className="relative w-20">
                 <input 
                   type="number"
                   value={leverage} 
                   onChange={(e) => setLeverage(Number(e.target.value))}
                   className="w-full bg-[#181B1F] border border-transparent rounded p-1.5 text-center text-sm outline-none text-white" 
                 />
               </div>
             </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[12px] text-gray-400">Entry price</label>
              <div className="relative">
                <input 
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-[#181B1F] border border-transparent rounded p-3 text-sm outline-none text-white placeholder:text-gray-600" 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">USDT</span>
              </div>
            </div>

            {activeTab === "Profit/ loss" && (
              <div className="space-y-1.5">
                <label className="text-[12px] text-gray-400">Target price</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-[#181B1F] border border-transparent rounded p-3 text-sm outline-none text-white placeholder:text-gray-600" 
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">USDT</span>
                </div>
              </div>
            )}

            {activeTab === "Target Price" && (
              <div className="space-y-1.5">
                <label className="text-[12px] text-gray-400">ROI %</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={roi}
                    onChange={(e) => setRoi(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-[#181B1F] border border-transparent rounded p-3 text-sm outline-none text-white placeholder:text-gray-600" 
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">%</span>
                </div>
              </div>
            )}

            {activeTab === "Liquidation price" && (
              <div className="space-y-1.5">
                <label className="text-[12px] text-gray-400">Margin Balance</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={marginBalance}
                    onChange={(e) => setMarginBalance(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-[#181B1F] border border-transparent rounded p-3 text-sm outline-none text-white placeholder:text-gray-600" 
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">USDT</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[12px] text-gray-400">Size</label>
              <div className="relative">
                <input 
                  type="number"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-[#181B1F] border border-transparent rounded p-3 text-sm outline-none text-white placeholder:text-gray-600" 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">Asset</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[13px] font-bold text-white">Result</h3>
            
            {activeTab === "Profit/ loss" && (
              <>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Initial Margin</span>
                  <span className="text-white font-medium">{resultInitialMargin.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">PNL</span>
                  <span className={`font-medium ${resultPnL >= 0 ? 'text-[#0ECB81]' : 'text-[#FF383C]'}`}>
                    {resultPnL > 0 ? '+' : ''}{resultPnL.toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">ROI</span>
                  <span className={`font-medium ${resultROI >= 0 ? 'text-[#0ECB81]' : 'text-[#FF383C]'}`}>
                    {resultROI > 0 ? '+' : ''}{resultROI.toFixed(2)}%
                  </span>
                </div>
              </>
            )}

            {activeTab === "Target Price" && (
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Target Price</span>
                <span className="text-white font-medium">{resultTargetPrice.toFixed(4)} USDT</span>
              </div>
            )}

            {activeTab === "Liquidation price" && (
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Liquidation Price</span>
                <span className="text-[#FF383C] font-medium">{resultLiquidationPrice.toFixed(4)} USDT</span>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <button 
            onClick={calculateResults}
            className="w-full py-3.5 bg-[#00B595] hover:bg-[#00a086] text-white rounded font-bold text-sm cursor-pointer transition-colors mt-2"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}
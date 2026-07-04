"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  FaChartLine,
  FaPlus,
  FaCaretDown,
  FaPen,
  FaRulerCombined,
  FaDrawPolygon,
  FaMagnet,
} from "react-icons/fa";
import {
  MdOutlineOpenInFull,
  MdOutlineGridView,
  MdClose,
} from "react-icons/md";
import { IoEyeOutline, IoSettingsOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { HiMenuAlt2 } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";

import {
  LuMousePointer2,
  LuType,
  LuSmile,
  LuRuler,
  LuMagnet,
  LuEraser,
} from "react-icons/lu";
import { FiMove, FiLayers } from "react-icons/fi";
import { MdOutlineArchitecture, MdOutlineBrush } from "react-icons/md";
import { BiShapeTriangle } from "react-icons/bi";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function FutureTradingChart() {
  const [hoverData, setHoverData] = useState({
    open: 20362.21,
    high: 20367.78,
    low: 19549.09,
    close: 19965.74,
    change: -1.94,
    amplitude: 4.02,
  });

  const { candles, volume, lastPrice } = useMemo(() => {
    let currentPrice = 22000;
    let currentTime = new Date("2022-11-01").getTime();
    const candles: any[] = [];
    const volume: any[] = [];

    for (let i = 0; i < 120; i++) {
      const open = currentPrice;
      const close = open + (Math.random() - 0.5) * 600;
      const high = Math.max(open, close) + Math.random() * 200;
      const low = Math.min(open, close) - Math.random() * 200;
      const vol = Math.floor(Math.random() * 400000) + 100000;

      candles.push({ x: currentTime, y: [open, high, low, close] });
      volume.push({
        x: currentTime,
        y: vol,
        fillColor: close > open ? "#26a69a" : "#ef5350",
      });

      currentPrice = close;
      currentTime += 86400000;
    }

    return {
      candles,
      volume,
      lastPrice: candles[candles.length - 1].y[3],
    };
  }, []);

  const mainOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        id: "candles",
        group: "sync-charts",
        type: "candlestick",
        background: "transparent",
        toolbar: { show: false },
        animations: { enabled: false },
        events: {
          mouseMove: (_, __, config) => {
            const i = config.dataPointIndex;
            if (i > -1 && candles[i]) {
              const d = candles[i].y;
              setHoverData({
                open: d[0],
                high: d[1],
                low: d[2],
                close: d[3],
                change: parseFloat((((d[3] - d[0]) / d[0]) * 100).toFixed(2)),
                amplitude: parseFloat(
                  (((d[1] - d[2]) / d[2]) * 100).toFixed(2),
                ),
              });
            }
          },
        },
      },
      annotations: {
        yaxis: [
          {
            y: lastPrice,
            borderColor: "#ef5350",
            label: {
              text: lastPrice.toFixed(2),
              position: "right",
              style: { color: "#fff", background: "#ef5350" },
            },
          },
        ],
      },
      theme: { mode: "dark" },
      xaxis: {
        type: "datetime",
        labels: { show: false },
        axisTicks: { show: false },
        axisBorder: { show: false },
      },
      yaxis: {
        opposite: true,
        labels: {
          style: { colors: "#71717a", fontSize: "10px" },
          formatter: (v) => v.toFixed(0),
        },
      },
      grid: { borderColor: "#1e1e1e", xaxis: { lines: { show: true } } },
      plotOptions: {
        candlestick: { colors: { upward: "#26a69a", downward: "#ef5350" } },
      },
      tooltip: { enabled: false },
    }),
    [candles, lastPrice],
  );

  const volumeOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        id: "volume",
        group: "sync-charts",
        type: "bar",
        background: "transparent",
        toolbar: { show: false },
        animations: { enabled: false },
      },
      theme: { mode: "dark" },
      xaxis: {
        type: "datetime",
        labels: {
          style: { colors: "#52525b", fontSize: "10px" },
          datetimeUTC: false,
          format: "dd MMM",
        },
        axisBorder: { show: false },
        tickAmount: 6,
      },
      yaxis: {
        opposite: true,
        labels: {
          style: { colors: "#71717a", fontSize: "10px" },
          formatter: (v) => (v / 1000).toFixed(0) + "K",
        },
        tickAmount: 2,
      },
      grid: {
        borderColor: "#1e1e1e",
        xaxis: { lines: { show: true } },
        padding: { bottom: 10 },
      },
      plotOptions: { bar: { columnWidth: "85%" } },
      dataLabels: { enabled: false },
      tooltip: { enabled: false },
    }),
    [],
  );

  return (
    <div className="bg-[#181818] w-full h-full font-manrope flex flex-col overflow-hidden">
      <div className="flex items-center justify-between overflow-x-auto px-3 md:py-3 py-1.5 gap-3 font-semibold bg-[#181818] border-b border-white/5">
        <div className="flex items-center gap-3">
          {["Time", "1s", "15m", "1H", "4H", "1D", "1W"].map((t) => (
            <button
              key={t}
              className={`md:text-[12px] text-[10px] ${t === "1D" ? "text-[#f0b90b]" : "text-gray-500 hover:text-white"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 md:text-[12px] text-[10px]">
          <span className="text-[#f0b90b]">Original</span>
          <span className="text-gray-500 hover:text-white">TradingView</span>
          <span className="text-gray-500 hover:text-white">Depth</span>
          <MdOutlineOpenInFull size={15} className="text-gray-500" />
          <MdOutlineGridView size={13} className="text-gray-500" />
        </div>
      </div>

      <div className="flex md:ml-10 flex-col flex-wrap items-start md:gap-1 md:px-4 px-2 md:py-2 py-1 md:text-[12px] text-[9px] border-b border-white/5 bg-[#181818]">
        <div className="flex items-center gap-1">
          <button className="text-gray-500 cursor-pointer">
            <FaCaretDown size={10} />
          </button>
          <span className="text-gray-500">{new Date().toLocaleDateString()}</span>
          <span className="text-gray-500 ml-2">Open:</span>
          <span className="text-[#ef5350]">{hoverData.open.toFixed(2)}</span>
          <span className="text-gray-500 ml-2">High:</span>
          <span className="text-[#26a69a]">{hoverData.high.toFixed(2)}</span>
          <span className="text-gray-500 ml-2">Low:</span>
          <span className="text-[#ef5350]">{hoverData.low.toFixed(2)}</span>
          <span className="text-gray-500 ml-2">Close:</span>
          <span className="text-[#ef5350]">{hoverData.close.toFixed(2)}</span>
        </div>
        <div className="gap-1 flex items-center mt-1">
          <button className="text-gray-500 cursor-pointer">
            <FaCaretDown size={10} />
          </button>
          <span className="text-[#f0b90b]">MA(7): 21631.17</span>
          <span className="text-[#9c27b0]">MA(25): 23133.19</span>
          <div className="flex items-center gap-2 ml-4">
            <button className="text-gray-500 hover:text-white cursor-pointer">
              <IoEyeOutline size={14} />
            </button>
            <button className="text-gray-500 hover:text-white cursor-pointer">
              <IoSettingsOutline size={14} />
            </button>
            <button className="text-gray-500 hover:text-white cursor-pointer">
              <RxCross2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute md:left-0 top-65 md:w-8 w-5 bg-[#0c0e0f] flex flex-col md:h-116.25 h-82.5 items-center py-4 md:gap-5 gap-3 z-50 border-r border-white/5">
        <LuMousePointer2
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <LuType
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <MdOutlineArchitecture
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <BiShapeTriangle
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <LuType
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <LuSmile
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <div className="w-6 h-px bg-white/10 my-1" />

        <LuRuler
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <LuRuler
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <div className="w-6 h-px bg-white/10 my-1" />

        <LuMagnet
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <FiLayers
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />

        <LuEraser
          size={16}
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        />
      </div>

      {/* CHART AREA */}
      <div className="fgrow flex flex-col relative overflow-hidden">
        <div className="absolute md:top-30 top-20 md:left-20 left-15  z-30">
          <div className="flex items-center bg-[#242424] rounded-lg overflow-hidden">
            <div className="px-3 text-gray-50">
              <GiHamburgerMenu size={14} />
            </div>
            <div className="bg-[#34C759] px-4 py-4 text-white text-center">
              <div className="md:text-[12px] text-[6px]">Buy / Long</div>
              <div className="md:text-lg text-xs">89,057</div>
            </div>
            <div className="px-4 py-2 text-gray-400 border-x border-white/10 text-center">
              <div className="md:text-[15px] text-xs text-white">
                Size (USDT)
              </div>
              <div className="text-gray-500 text-xs">Enter Size</div>
            </div>
            <div className="bg-[#FF383C] px-4 py-4 text-white text-center">
              <div className="md:text-[12px] text-[6px]">Sell / Short</div>
              <div className="md:text-lg text-xs">89,057</div>
            </div>
            <div className="px-3 text-gray-50">
              <MdClose size={14} />
            </div>
          </div>
        </div>

        <div className="grow relative">
          <Chart
            options={mainOptions}
            series={[{ data: candles }]}
            type="candlestick"
            height="100%"
          />
        </div>

        <div className="h-32 border-t border-white/5">
          <Chart
            options={volumeOptions}
            series={[{ name: "Volume", data: volume }]}
            type="bar"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}

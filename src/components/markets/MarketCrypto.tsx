"use client";
import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { FaPlayCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

const PairIcon = ({ icons, isSingle = false }: { icons: string[]; isSingle?: boolean }) => {
    if (icons.length === 1 || isSingle) {
        return (
            <img 
                src={icons[0]} 
                className="w-7 h-7 rounded-full object-cover bg-gray-700" 
                alt="" 
                onError={(e) => { 
                    (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/32?text=📈'; 
                }} 
            />
        );
    }

    return (
        <div className="relative flex items-center w-10 h-7">
            <img
                src={icons[0]}
                className="w-7 h-7 rounded-full border-2 border-[#181818] z-0 object-cover bg-gray-700"
                alt="base"
                onError={(e) => { 
                    (e.currentTarget as HTMLImageElement).src = 'https://flagcdn.com/w80/us.png'; 
                }}
            />
            <img
                src={icons[1]}
                className="w-7 h-7 rounded-full border-2 border-[#181818] -ml-3 z-10 object-cover bg-gray-700"
                alt="quote"
                onError={(e) => { 
                    (e.currentTarget as HTMLImageElement).src = 'https://flagcdn.com/w80/us.png'; 
                }}
            />
        </div>
    );
};

interface MarketData {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
    marketCap: number;
    image: string;
    sparkline: number[];
}

interface CardData {
    pair: string;
    price: string;
    vol: string;
    icons: string[];
    change: string;
}

interface TableData {
    pair: string;
    price: string;
    change: string;
    high: string;
    low: string;
    volume: string;
    icons: string[];
}

const MarketContent = ({ cardData, tableData }: { cardData: CardData[], tableData: TableData[] }) => {
    const router = useRouter()
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {cardData.slice(0, 4).map((item, i) => (
                    <div key={i} className="bg-[#222222] rounded-xl p-5 cursor-pointer group hover:bg-[#282828] transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <PairIcon icons={item.icons} />
                                <span className="text-sm font-bold text-gray-50 ml-1">{item.pair}</span>
                            </div>
                            <span className={`text-sm font-semibold ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{item.change}</span>
                        </div>
                        <div className="text-2xl mb-1 font-bold">{item.price}</div>
                        <div className="flex justify-between items-center text-gray-500 ">
                            <span className="text-sm font-semibold">{item.vol}</span>
                            <FaPlayCircle size={18} fill="currentColor" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-225">
                    <thead>
                        <tr className="text-gray-500 text-sm font-semibold border-b border-white/5">
                            <th className="text-left pb-4 font-medium">Trading pairs</th>
                            <th className="text-left pb-4 font-medium px-4">Last traded price</th>
                            <th className="text-left pb-4 font-medium px-4">24H Change %</th>
                            <th className="text-left pb-4 font-medium px-4">24H High</th>
                            <th className="text-left pb-4 font-medium px-4">24H Low</th>
                            <th className="text-left pb-4 font-medium px-4">Market Volume</th>
                            <th className="text-left pb-4 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/2">
                        {tableData.map((row, idx) => (
                            <tr key={idx} className="group hover:bg-white/2 transition-colors">
                                <td className="py-5">
                                    <div className="flex items-center gap-3">
                                        <PairIcon icons={row.icons} />
                                        <span className="font-bold text-sm tracking-tight">{row.pair}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-4 font-bold text-sm">${parseFloat(row.price.replace(/,/g, '')).toFixed(2)}</td>
                                <td className={`py-5 px-4 font-bold text-sm ${row.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{row.change}</td>
                                <td className="py-5 px-4 font-bold text-sm">${parseFloat(row.high.replace(/,/g, '')).toFixed(2)}</td>
                                <td className="py-5 px-4 font-bold text-sm">${parseFloat(row.low.replace(/,/g, '')).toFixed(2)}</td>
                                <td className="py-5 px-4 font-bold text-sm">{row.volume}</td>
                                <td className="py-5">
                                    <div className="flex items-center gap-3">
                                        <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:bg-white/10 transition-colors cursor-pointer">
                                            <FileText size={16} />
                                        </button>
                                        <button type='button' onClick={() => router.push('/dashboard/spot-trade')} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all cursor-pointer">
                                            Trade
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default function MarketComponent() {
    const [activeCategory, setActiveCategory] = useState("Crypto");
    const [activeTab, setActiveTab] = useState("Spot");
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [filteredData, setFilteredData] = useState<MarketData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const categories = ["Crypto", "Forex", "Commodities", "Stocks", "Indices"];
    const subTabs = ["Favorites", "Spot", "Futures"];

    // Fetch market data via REST API with auto-refresh every 30s
    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                if (marketData.length === 0) setLoading(true);
                let endpoint = '/api/market/prices';
                
                if (activeCategory === 'Forex') endpoint = '/api/market/forex';
                else if (activeCategory === 'Commodities') endpoint = '/api/market/commodities';
                else if (activeCategory === 'Stocks') endpoint = '/api/market/stocks';
                else if (activeCategory === 'Indices') endpoint = '/api/market/indices';
                
                const data = await apiRequest(endpoint.replace('/api', ''));
                updateMarketDataFromSocket(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching market data:', err);
                setLoading(false);
            }
        };

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 30000);
        return () => clearInterval(interval);
    }, [activeCategory]);

    // Helper function to update market data from socket
    const updateMarketDataFromSocket = (data: any) => {
        let formatted: MarketData[] = [];
        
        if (activeCategory === 'Crypto') {
            formatted = Object.entries(data).map(([symbol, details]: [string, any]) => ({
                id: details.id || symbol.toLowerCase(),
                symbol,
                name: details.name || symbol,
                price: parseFloat(details.usd || details.price || 0),
                change24h: parseFloat(details.change24h || 0),
                high24h: parseFloat(details.high24h || details.usd * 1.02 || 0),
                low24h: parseFloat(details.low24h || details.usd * 0.98 || 0),
                volume24h: details.volume24h || 0,
                marketCap: details.marketCap || 0,
                image: details.image || getIconUrl(symbol),
                sparkline: []
            }));
        } else if (activeCategory === 'Forex') {
            formatted = Object.entries(data).map(([key, details]: [string, any]) => ({
                id: key.toLowerCase(),
                symbol: details.pair?.split('/')[0] || key,
                name: details.pair || key,
                price: details.price || 0,
                change24h: details.change24h || 0,
                high24h: details.high24h || 0,
                low24h: details.low24h || 0,
                volume24h: details.volume24h || 0,
                marketCap: 0,
                image: details.logo || details.icons?.[0] || 'https://flagcdn.com/w80/us.png',
                sparkline: []
            }));
        } else if (activeCategory === 'Commodities') {
            formatted = Object.entries(data).map(([key, details]: [string, any]) => ({
                id: key.toLowerCase(),
                symbol: details.symbol || key,
                name: details.name || key,
                price: details.price || 0,
                change24h: details.change24h || 0,
                high24h: details.high24h || 0,
                low24h: details.low24h || 0,
                volume24h: details.volume24h || 0,
                marketCap: 0,
                image: details.logo || details.image || `https://via.placeholder.com/100?text=${details.symbol || key}`,
                sparkline: []
            }));
        } else if (activeCategory === 'Stocks') {
            formatted = Object.entries(data).map(([key, details]: [string, any]) => ({
                id: key.toLowerCase(),
                symbol: details.symbol || key,
                name: details.name || key,
                price: details.price || 0,
                change24h: details.change24h || 0,
                high24h: details.high24h || 0,
                low24h: details.low24h || 0,
                volume24h: details.volume24h || 0,
                marketCap: 0,
                image: details.logo || `https://via.placeholder.com/100?text=${details.symbol || key}`,
                sparkline: []
            }));
        } else if (activeCategory === 'Indices') {
            formatted = Object.entries(data).map(([key, details]: [string, any]) => ({
                id: key.toLowerCase(),
                symbol: details.symbol || key,
                name: details.name || key,
                price: details.value || details.price || 0,
                change24h: details.change24h || 0,
                high24h: details.high24h || 0,
                low24h: details.low24h || 0,
                volume24h: details.volume24h || 0,
                marketCap: 0,
                image: details.logo || `https://via.placeholder.com/100?text=${details.symbol || key}`,
                sparkline: []
            }));
        }
        
        setMarketData(formatted);
        filterData(formatted, searchTerm);
    };

    const filterData = (data: MarketData[], search: string) => {
        if (!search) {
            setFilteredData(data);
            return;
        }
        
        const filtered = data.filter(item => 
            item.symbol.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        filterData(marketData, value);
    };

    const getIconUrl = (symbol: string) => {
        const iconMap: { [key: string]: string } = {
            BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
            ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
            USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
            SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
            BNB: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
        };
        return iconMap[symbol] || 'https://cryptologos.cc/logos/generic-crypto-logo.png';
    };

    const getCurrentData = () => {
        const displayData = filteredData.slice(0, 10);
        
        const cards: CardData[] = displayData.slice(0, 4).map(item => {
            const priceValue = activeCategory === 'Indices' ? item.price : item.price;
            let icons = [item.image];
            
            // For Forex, show two flags if available
            if (activeCategory === 'Forex') {
                const parts = (item.name || '').split('/');
                const flag1 = parts[0] ? `https://flagcdn.com/w80/${getFlagCode(parts[0])}.png` : item.image;
                const flag2 = parts[1] ? `https://flagcdn.com/w80/${getFlagCode(parts[1])}.png` : item.image;
                icons = [flag1, flag2];
            }
            
            return {
                pair: activeCategory === 'Crypto' 
                    ? `${item.symbol} / USDT`
                    : activeCategory === 'Forex'
                    ? item.name
                    : `${item.symbol}`,
                price: `$${priceValue.toFixed(2)}`,
                vol: `24h Vol $${(item.volume24h / 1e9).toFixed(1)}B`,
                icons: icons,
                change: `${item.change24h.toFixed(2)}%`
            };
        });

        const table: TableData[] = displayData.map(item => {
            const priceValue = activeCategory === 'Indices' ? item.price : item.price;
            let icons = [item.image];
            
            // For Forex, show two flags if available
            if (activeCategory === 'Forex') {
                const parts = (item.name || '').split('/');
                const flag1 = parts[0] ? `https://flagcdn.com/w80/${getFlagCode(parts[0])}.png` : item.image;
                const flag2 = parts[1] ? `https://flagcdn.com/w80/${getFlagCode(parts[1])}.png` : item.image;
                icons = [flag1, flag2];
            }
            
            return {
                pair: activeCategory === 'Crypto' 
                    ? `${item.symbol}/USDT`
                    : activeCategory === 'Forex'
                    ? item.name
                    : item.symbol,
                price: priceValue.toFixed(2),
                change: `${item.change24h.toFixed(2)}%`,
                high: item.high24h.toFixed(2),
                low: item.low24h.toFixed(2),
                volume: `${(item.volume24h / 1e9).toFixed(2)}B`,
                icons: icons
            };
        });

        return { cards, table };
    };

    const getFlagCode = (currency: string) => {
        const codes: { [key: string]: string } = {
            'EUR': 'eu',
            'USD': 'us',
            'GBP': 'gb',
            'JPY': 'jp',
            'AUD': 'au',
            'CAD': 'ca',
            'CHF': 'ch',
            'CNY': 'cn',
            'INR': 'in',
        };
        return codes[currency.toUpperCase()] || 'us';
    };

    const currentData = getCurrentData();

    return (
        <div className="bg-[#181818] min-h-screen text-white p-4 md:p-10 font-manrope">
            <div className="max-w-350 mx-auto">
                <div className='flex items-center mb-5 justify-between'>
                    <h1 className="text-3xl font-bold">Market</h1>

                    <div className="relative w-40 md:w-60">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-50" size={14} />
                        <input
                            type="text"
                            placeholder="Search for currency pairs"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full bg-[#222222] md:py-5 py-3 pl-11 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all rounded-lg"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex mb-10 overflow-hidden rounded-lg">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`md:px-6 px-2 py-5 md:text-[14px] text-[11px] font-semibold transition-all cursor-pointer 
                                ${activeCategory === cat ? "bg-[#2B2B2B] text-white" : "bg-[#1E1E1E] text-gray-500 hover:text-gray-300"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sub Tabs */}
                {activeCategory === "Crypto" && (
                    <div className="flex items-center gap-6 mb-6 border-b border-white/5">
                        {subTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer
          ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.75 bg-blue-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="text-gray-400">Loading market data...</div>
                    </div>
                ) : (
                    <MarketContent cardData={currentData.cards} tableData={currentData.table} />
                )}
            </div>
        </div>
    );
}
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Leaf,
  AlertTriangle,
  X
} from 'lucide-react';
import WeatherWidget from './components/WeatherWidget';
import PriceChart from './components/PriceChart';
import AIInsight from './components/AIInsight';
import { 
  SOIL_DATA, 
  YIELD_DATA, 
  CROPS,
  parsePriceData 
} from './data/mockData';
import { PriceRecord, WeatherData, Tab } from './types';

// Mock function to simulate weather based on date
// Requirement: "add the weather data as per the day changes it should update"
const generateWeather = (dateString: string): WeatherData => {
  const date = new Date(dateString);
  const month = date.getMonth(); // 0-11
  
  // Base temps for Telangana/AP roughly
  let baseTemp = 30;
  let condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' = 'Sunny';
  let rainfall = 0;
  let humidity = 50;
  
  // Simple seasonality logic
  if (month >= 3 && month <= 5) { // Summer (April-June)
    baseTemp = 38;
    condition = 'Sunny';
    humidity = 35;
  } else if (month >= 6 && month <= 8) { // Monsoon (July-Sept)
    baseTemp = 28;
    condition = 'Rainy';
    rainfall = Math.floor(Math.random() * 50) + 10;
    humidity = 85;
  } else if (month >= 9 && month <= 10) { // Post-Monsoon
    baseTemp = 30;
    condition = 'Cloudy';
    humidity = 65;
  } else { // Winter (Nov-Feb)
    baseTemp = 24;
    condition = 'Sunny';
    humidity = 45;
  }

  // Add some daily randomness
  const temp = Math.floor(baseTemp + (Math.random() * 5 - 2));
  
  // Calculate Risk
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (rainfall > 40 || temp > 42) riskLevel = 'High';
  else if (rainfall > 10 || temp > 38) riskLevel = 'Medium';

  return {
    temp,
    humidity: humidity + Math.floor(Math.random() * 10 - 5),
    rainfall,
    condition,
    riskLevel
  };
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  
  // Global State
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Warangal");
  const [selectedDate, setSelectedDate] = useState<string>("2023-06-19");
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");

  // Alert State
  const [showRiskAlert, setShowRiskAlert] = useState<boolean>(true);

  // Data Loading
  const priceData = useMemo<PriceRecord[]>(() => parsePriceData(), []);
  
  // Derived State
  const currentWeather = useMemo(() => generateWeather(selectedDate), [selectedDate]);
  
  // Reset alert when weather/date changes
  useEffect(() => {
    setShowRiskAlert(true);
  }, [selectedDate, currentWeather.riskLevel]);

  const currentSoil = SOIL_DATA.find(s => s.district === selectedDistrict);
  
  const relevantYields = YIELD_DATA.filter(
    y => y.district === selectedDistrict
  );

  const getAveragePrice = () => {
    const prices = priceData
      .filter(p => p.market === selectedDistrict) // CSV uses 'market', assuming distinct market approx district
      .filter(p => p.crop === selectedCrop);
    if (!prices.length) return 0;
    const sum = prices.reduce((acc, curr) => acc + curr.price, 0);
    return Math.round(sum / prices.length);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sprout className="w-8 h-8 text-emerald-400" />
              <h1 className="text-2xl font-bold tracking-tight">AgroPulse</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab(Tab.DASHBOARD)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === Tab.DASHBOARD ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab(Tab.RECOMMENDATIONS)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === Tab.RECOMMENDATIONS ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <Leaf className="w-4 h-4" />
                Crop Advisor
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Global Filters */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> District
            </label>
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full sm:w-48 rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {SOIL_DATA.map(d => (
                <option key={d.district} value={d.district}>{d.district}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Sprout className="w-4 h-4" /> Crop Interest
            </label>
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full sm:w-48 rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {CROPS.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Date
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-48 rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </section>

        {/* Dashboard View */}
        {activeTab === Tab.DASHBOARD && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Charts */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Risk Alert Section */}
              {showRiskAlert && (currentWeather.riskLevel === 'High' || currentWeather.riskLevel === 'Medium') && (
                <div className={`rounded-xl p-4 border flex items-start justify-between shadow-sm ${
                  currentWeather.riskLevel === 'High' 
                    ? 'bg-red-50 border-red-200 text-red-900' 
                    : 'bg-yellow-50 border-yellow-200 text-yellow-900'
                }`}>
                  <div className="flex gap-3">
                    <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
                      currentWeather.riskLevel === 'High' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <div>
                      <h3 className="font-bold text-lg">
                        {currentWeather.riskLevel === 'High' ? 'Severe Weather Warning' : 'Weather Advisory'}
                      </h3>
                      <p className="mt-1 text-sm opacity-90">
                        {currentWeather.riskLevel === 'High' 
                          ? `Extreme conditions detected (Temp: ${currentWeather.temp}°C, Rain: ${currentWeather.rainfall}mm). Immediate crop protection measures recommended.` 
                          : `Moderate risk detected due to ${currentWeather.temp > 35 ? 'high temperatures' : 'rainfall'}. Monitor field conditions closely.`
                        }
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRiskAlert(false)}
                    className="p-1 hover:bg-black/5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <AIInsight 
                district={selectedDistrict}
                crop={selectedCrop}
                date={selectedDate}
                weather={currentWeather}
                soil={currentSoil}
                avgPrice={getAveragePrice()}
              />
              
              <PriceChart 
                data={priceData} 
                crop={selectedCrop} 
                market={selectedDistrict} 
              />

              {/* Soil Info Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Soil Profile: {selectedDistrict}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-semibold text-stone-700">{currentSoil?.soil_type || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-500">Nitrogen (N)</p>
                    <p className="font-semibold text-blue-700">{currentSoil?.nitrogen || '-'}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-500">Phosphorus (P)</p>
                    <p className="font-semibold text-orange-700">{currentSoil?.phosphorus || '-'}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-500">Potassium (K)</p>
                    <p className="font-semibold text-purple-700">{currentSoil?.potassium || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Weather & Quick Actions */}
            <div className="space-y-8">
              <WeatherWidget weather={currentWeather} date={selectedDate} />
              
              <div className="bg-emerald-800 text-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2">Market Alert</h3>
                <p className="text-emerald-100 mb-4 text-sm">
                  {selectedCrop} prices in {selectedDistrict} are trending 
                  <span className="font-bold text-white"> {getAveragePrice() > 1200 ? 'High' : 'Normal'} </span> 
                  compared to last season.
                </p>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-3/4"></div>
                </div>
                <p className="text-xs text-emerald-200 mt-2 text-right">High Demand</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations View */}
        {activeTab === Tab.RECOMMENDATIONS && (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Yield Analysis & Recommendations</h2>
              <p className="text-gray-500 text-sm mt-1">Based on historical yield data for {selectedDistrict}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Yield (Kg/Hectare)</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profitability Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {relevantYields.length > 0 ? relevantYields.map((record, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{record.season}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.crop}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.yield}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full" 
                              style={{ width: `${(record.yield / 8000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            {Math.round((record.yield / 8000) * 100)}/100
                          </span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No yield data available for this district.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-emerald-50 border-t border-emerald-100">
              <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Recommendation
              </h4>
              {relevantYields.length > 0 ? (
                <p className="text-sm text-emerald-800">
                  For the <strong>{selectedDistrict}</strong> district with <strong>{currentSoil?.soil_type}</strong> soil, 
                  <strong> {relevantYields.sort((a,b) => b.yield - a.yield)[0]?.crop} </strong> 
                  in the <strong>{relevantYields.sort((a,b) => b.yield - a.yield)[0]?.season}</strong> season 
                  yields the highest output ({relevantYields.sort((a,b) => b.yield - a.yield)[0]?.yield} kg/ha).
                </p>
              ) : (
                 <p className="text-sm text-emerald-800">Select a district with available data to see recommendations.</p>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
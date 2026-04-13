import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import DatasetAnalysis from './components/DatasetAnalysis';
import { PatientData, PredictionResponse, HeartDataRow } from './types';
import { analyzeHeartHealth } from './services/geminiService';
import { RAW_CSV_DATA } from './constants';
import { parseCSV } from './utils';

const App: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HeartDataRow[]>([]);
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Load CSV data on mount
  useEffect(() => {
    try {
      const parsed = parseCSV(RAW_CSV_DATA);
      setHistoricalData(parsed);
    } catch (e) {
      console.error("Failed to parse CSV data", e);
    }
  }, []);

  const handleFormSubmit = async (data: PatientData) => {
    setIsLoading(true);
    setError(null);
    setCurrentPatient(data);
    try {
      const result = await analyzeHeartHealth(data);
      setPrediction(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis. Please check your API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setCurrentPatient(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setShowAnalysis(false)}>
              <div className="flex-shrink-0 flex items-center">
                <svg className="w-8 h-8 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-xl tracking-tight text-slate-800">HeartGuard AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
               <button 
                 onClick={() => setShowAnalysis(!showAnalysis)}
                 className={`text-sm font-medium transition-colors ${showAnalysis ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'}`}
               >
                 {showAnalysis ? 'Assessment Tool' : 'Data Analysis'}
               </button>
               <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-500 hidden sm:inline-block">
                 Gemini 2.5 Powered
               </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {showAnalysis ? (
          <DatasetAnalysis data={historicalData} onBack={() => setShowAnalysis(false)} />
        ) : (
          <>
            {/* Intro / Banner */}
            {!prediction && (
              <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Advanced Heart Disease Prediction
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Leveraging clinical data and artificial intelligence to assess heart health risk factors. 
                  Enter patient vitals below for a comprehensive analysis.
                </p>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* View Switcher */}
            {prediction && currentPatient ? (
              <Dashboard 
                prediction={prediction} 
                patientData={currentPatient} 
                historicalData={historicalData} 
                onReset={handleReset} 
              />
            ) : (
              <div className="max-w-3xl mx-auto">
                <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </div>
            )}
          </>
        )}

      </main>
      
      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} HeartGuard AI. Not for medical diagnosis. Consult a professional.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
